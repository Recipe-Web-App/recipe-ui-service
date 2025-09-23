import type { CommandGroup, SearchResult } from '@/types/ui/command-palette';

/**
 * Fuzzy search implementation for commands
 */
export const fuzzySearch = (searchTerm: string, text: string): number => {
  if (!searchTerm) return 1;

  const searchLower = searchTerm.toLowerCase();
  const textLower = text.toLowerCase();

  // Exact match gets highest score
  if (textLower.includes(searchLower)) {
    return 0.9;
  }

  // Fuzzy matching - check if all characters exist in order
  let searchIndex = 0;
  let textIndex = 0;
  let matches = 0;

  while (searchIndex < searchLower.length && textIndex < textLower.length) {
    // Safe string indexing - bounds checked in while condition
    // eslint-disable-next-line security/detect-object-injection
    if (searchLower[searchIndex] === textLower[textIndex]) {
      matches++;
      searchIndex++;
    }
    textIndex++;
  }

  // Score based on how many characters matched and their density
  if (matches === searchLower.length) {
    return Math.max(0.1, matches / textLower.length);
  }

  return 0;
};

/**
 * Filter and score commands based on search term
 */
export const filterCommands = (
  commands: CommandGroup[],
  searchTerm: string,
  enableFuzzySearch: boolean = true
): SearchResult[] => {
  if (!searchTerm.trim()) {
    return commands.flatMap(group =>
      group.commands
        .filter(command => !command.disabled)
        .map(command => ({
          command,
          group,
          score: 1,
        }))
    );
  }

  const results: SearchResult[] = [];

  commands.forEach(group => {
    if (group.hidden) return;

    group.commands.forEach(command => {
      if (command.disabled) return;

      let score = 0;

      if (enableFuzzySearch) {
        // Calculate scores for different fields
        const labelScore = fuzzySearch(searchTerm, command.label) * 1.0;
        const descriptionScore = command.description
          ? fuzzySearch(searchTerm, command.description) * 0.7
          : 0;
        const keywordsScore =
          command.keywords && command.keywords.length > 0
            ? Math.max(
                ...command.keywords.map(keyword =>
                  fuzzySearch(searchTerm, keyword)
                )
              ) * 0.8
            : 0;

        score = Math.max(labelScore, descriptionScore, keywordsScore);
      } else {
        // Simple substring matching
        const searchLower = searchTerm.toLowerCase();
        const labelMatch = command.label.toLowerCase().includes(searchLower);
        const descriptionMatch = command.description
          ?.toLowerCase()
          .includes(searchLower);
        const keywordsMatch =
          command.keywords && command.keywords.length > 0
            ? command.keywords.some(keyword =>
                keyword.toLowerCase().includes(searchLower)
              )
            : false;

        if (labelMatch || descriptionMatch || keywordsMatch) {
          score = labelMatch ? 1 : 0.7;
        }
      }

      if (score > 0.1) {
        results.push({
          command,
          group,
          score,
        });
      }
    });
  });

  // Sort by score (highest first)
  return results.sort((a, b) => b.score - a.score);
};
