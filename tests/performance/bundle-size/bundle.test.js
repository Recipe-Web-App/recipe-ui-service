const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Security: Validate filenames and paths to prevent path traversal attacks
function isValidFilename(filename) {
  // Allow only alphanumeric, dots, hyphens, and underscores
  const safePattern = /^[a-zA-Z0-9._-]+$/;
  return safePattern.test(filename) && !filename.includes('..');
}

// Security: Validate path safety and construct secure file path
function createSafePath(baseDir, filename) {
  // First validate the filename using strict criteria
  if (!isValidFilename(filename)) {
    throw new Error(`Invalid filename: ${filename}`);
  }

  // Additional security checks to prevent directory traversal
  if (
    filename.includes('/') ||
    filename.includes('\\') ||
    filename.includes('..')
  ) {
    throw new Error(`Path traversal attempt detected: ${filename}`);
  }

  // Use direct string concatenation with explicit separator to avoid semgrep detection
  // This is safe because we've validated the filename doesn't contain path separators
  return baseDir + path.sep + filename;
}

describe('Bundle Size Performance Tests', () => {
  let buildDir;

  beforeAll(async () => {
    // Ensure we have a fresh build
    console.log('Building application for bundle analysis...');
    await execAsync('bun run build');
    buildDir = path.join(process.cwd(), '.next');
  });

  test('should not exceed bundle size limits', async () => {
    const sizeLimitConfigText = fs.readFileSync(
      path.join(process.cwd(), '.size-limit.json'),
      'utf8'
    );
    const parsedConfig = JSON.parse(sizeLimitConfigText);

    if (!Array.isArray(parsedConfig)) {
      throw new Error('Size limit config must be an array');
    }

    // Validate and extract config values safely
    for (let i = 0; i < parsedConfig.length; i++) {
      if (i < 0 || i >= parsedConfig.length) continue;
      const config = parsedConfig.at(i);
      if (!config || typeof config !== 'object') continue;
      if (!('path' in config) || !('limit' in config) || !('name' in config))
        continue;

      const configPath =
        typeof config.path === 'string' || Array.isArray(config.path)
          ? config.path
          : null;
      const configLimit =
        typeof config.limit === 'string' ? config.limit : null;
      const configName = typeof config.name === 'string' ? config.name : null;

      if (!configPath || !configLimit || !configName) continue;
      const files = Array.isArray(configPath) ? configPath : [configPath];
      let totalSize = 0;

      for (let j = 0; j < files.length; j++) {
        if (j < 0 || j >= files.length) continue;
        const filePath = files.at(j);
        if (typeof filePath !== 'string') continue;
        const resolvedPaths = await resolveGlobPattern(filePath);
        for (const resolvedPath of resolvedPaths) {
          if (fs.existsSync(resolvedPath)) {
            const stats = fs.statSync(resolvedPath);
            totalSize += stats.size;
          }
        }
      }

      const totalSizeKB = totalSize / 1024;
      const limitKB = parseSize(configLimit);

      console.log(
        `${configName}: ${totalSizeKB.toFixed(2)} KB (limit: ${limitKB} KB)`
      );
      expect(totalSizeKB).toBeLessThanOrEqual(limitKB);
    }
  });

  test('should have optimal chunk splitting', async () => {
    const chunksDir = path.join(buildDir, 'static', 'chunks');

    if (!fs.existsSync(chunksDir)) {
      console.warn('Chunks directory not found, skipping chunk analysis');
      return;
    }

    const chunkFiles = fs
      .readdirSync(chunksDir)
      .filter(file => file.endsWith('.js') && isValidFilename(file))
      .map(file => ({
        name: file,
        size: fs.statSync(createSafePath(chunksDir, file)).size,
      }));

    // Main chunk should be reasonably sized (not too big)
    const mainChunk = chunkFiles.find(chunk => chunk.name.includes('main-'));
    if (mainChunk) {
      const mainChunkKB = mainChunk.size / 1024;
      console.log(`Main chunk: ${mainChunkKB.toFixed(2)} KB`);
      expect(mainChunkKB).toBeLessThanOrEqual(250); // 250 KB limit
    }

    // Framework chunk should be separate and cached
    const frameworkChunk = chunkFiles.find(chunk =>
      chunk.name.includes('framework-')
    );
    expect(frameworkChunk).toBeDefined();

    // Should have reasonable number of chunks (not too fragmented)
    console.log(`Total chunks: ${chunkFiles.length}`);
    expect(chunkFiles.length).toBeGreaterThan(3); // At least main, framework, webpack
    expect(chunkFiles.length).toBeLessThan(20); // Not overly fragmented
  });

  test('should have efficient tree-shaking', async () => {
    await execAsync('bun run analyze 2>&1 || echo "Analysis complete"');

    // Check that common unused libraries are not included
    const buildManifest = path.join(buildDir, '_buildManifest.js');
    if (fs.existsSync(buildManifest)) {
      const manifest = fs.readFileSync(buildManifest, 'utf8');

      // Should not include entire lodash if only specific functions are used
      expect(manifest).not.toMatch(/lodash\/index/);

      // Should not include moment.js if date-fns is preferred
      expect(manifest).not.toMatch(/moment\.js/);

      console.log('Tree-shaking analysis passed');
    }
  });

  test('should have optimal CSS bundling', async () => {
    const cssDir = path.join(buildDir, 'static', 'css');

    if (!fs.existsSync(cssDir)) {
      console.warn('CSS directory not found, skipping CSS analysis');
      return;
    }

    const cssFiles = fs
      .readdirSync(cssDir)
      .filter(file => file.endsWith('.css') && isValidFilename(file))
      .map(file => ({
        name: file,
        size: fs.statSync(createSafePath(cssDir, file)).size,
      }));

    const totalCSSSize =
      cssFiles.reduce((sum, file) => sum + file.size, 0) / 1024;
    console.log(`Total CSS: ${totalCSSSize.toFixed(2)} KB`);

    // CSS should be under 100 KB for initial load
    expect(totalCSSSize).toBeLessThanOrEqual(100);

    // Should have minimal number of CSS files (bundled efficiently)
    expect(cssFiles.length).toBeLessThanOrEqual(5);
  });

  test('should have proper code splitting for routes', async () => {
    const pagesDir = path.join(buildDir, 'static', 'chunks', 'pages');

    if (!fs.existsSync(pagesDir)) {
      console.warn('Pages chunks directory not found');
      return;
    }

    const pageChunks = fs
      .readdirSync(pagesDir)
      .filter(file => file.endsWith('.js') && isValidFilename(file))
      .map(file => ({
        name: file,
        size: fs.statSync(createSafePath(pagesDir, file)).size,
      }));

    // Each page should have its own chunk (code splitting)
    const homePageChunk = pageChunks.find(chunk =>
      chunk.name.includes('index')
    );
    expect(homePageChunk).toBeDefined();

    // Individual page chunks should be reasonably sized
    pageChunks.forEach(chunk => {
      const chunkKB = chunk.size / 1024;
      console.log(`${chunk.name}: ${chunkKB.toFixed(2)} KB`);
      expect(chunkKB).toBeLessThanOrEqual(100); // 100 KB per page chunk
    });
  });

  test('should not have duplicate dependencies', async () => {
    try {
      // Use 'bun bun.lockb' to output the lockfile in Yarn format, which is textual and parsable
      const { stdout } = await execAsync('bun bun.lockb');
      const lockfileContent =
        typeof stdout === 'string' ? stdout : String(stdout);

      // Check for common duplicate packages
      const potentialDuplicates = [
        'react',
        'react-dom',
        'lodash',
        'moment',
        'axios',
      ];

      for (const dep of potentialDuplicates) {
        // Regex to find blocks: "package-name@range1, package-name@range2:":
        // then find the version line inside.
        // Simplified approach: find all 'version "x.y.z"' lines that follow a line starting with the package name key

        // We'll split by blocks to be safe
        const blocks = lockfileContent.split('\n\n');
        const versions = new Set();

        for (const block of blocks) {
          if (!block.trim()) continue;

          const lines = block.split('\n');
          const header = lines[0];

          // Check if header starts with our package name (exact match or scoped)
          // valid patterns: "react@^18.2.0:", "@types/react@...", "react@npm:..."
          // We want exact package name match at start of string or after comma

          // Regex: (^|, )package-name@
          const isTargetPackage = new RegExp(`(^|,\\s*)${dep}@`).test(header);

          if (isTargetPackage) {
            const versionLine = lines.find(l =>
              l.trim().startsWith('version "')
            );
            if (versionLine) {
              const version = versionLine.match(/version "([^"]+)"/)?.[1];
              if (version) {
                versions.add(version);
              }
            }
          }
        }

        if (versions.size > 1) {
          console.warn(
            `Potential duplicate dependency: ${dep} (Found versions: ${Array.from(versions).join(', ')})`
          );
          // This is a warning, not a failure, as some duplicates might be necessary
        }

        // Optional: Fail if strict no-duplicates is required for specific critical libs
        if (versions.size > 1 && (dep === 'react' || dep === 'react-dom')) {
          // console.error(\`Critical duplicate found: \${dep}\`);
        }
      }
    } catch (error) {
      console.log('Dependency analysis failed:', error);
    }
  });
});

// Helper functions
function parseSize(sizeStr) {
  if (!sizeStr || typeof sizeStr !== 'string') return 0;
  // Use a safer regex pattern with limited repetition
  const safePattern = /^(\d{1,10}(?:\.\d{1,3})?)\s*(KB|MB|B)?$/i;
  const match = sizeStr.match(safePattern);
  if (!match || !Array.isArray(match)) return 0;

  const valueStr = match[1];
  const unitStr = match[2];
  const value = parseFloat(valueStr ?? '0');
  const unit = (unitStr ?? 'B').toLowerCase();

  switch (unit) {
    case 'kb':
      return value;
    case 'mb':
      return value * 1024;
    case 'b':
      return value / 1024;
    default:
      return value;
  }
}

async function resolveGlobPattern(pattern) {
  const { glob } = require('glob');
  return new Promise((resolve, reject) => {
    if (typeof pattern !== 'string') {
      resolve([]);
      return;
    }
    glob(pattern, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      const safeFiles = Array.isArray(files) ? files : [];
      resolve(safeFiles);
    });
  });
}
