#!/bin/bash

# Security Tools Setup Script for Recipe UI Service
# Installs all required security tools for enterprise-grade validation
# Run this script once during project setup

set -euo pipefail

echo "🔒 Setting up enterprise security tools..."

# Create local bin directory
mkdir -p ~/.local/bin
export PATH="$HOME/.local/bin:$PATH"

# Check if tools are already installed
check_tool() {
    local tool=$1
    if command -v "$tool" &> /dev/null; then
        echo "✅ $tool already installed"
        return 0
    else
        return 1
    fi
}

# Install semgrep via pip
if ! check_tool semgrep; then
    echo "📦 Installing semgrep..."
    pip install --user semgrep
fi

# Install gitleaks
if ! check_tool gitleaks; then
    echo "📦 Installing gitleaks..."
    cd /tmp
    curl -L -o gitleaks.tar.gz https://github.com/gitleaks/gitleaks/releases/download/v8.21.2/gitleaks_8.21.2_linux_x64.tar.gz
    tar -xzf gitleaks.tar.gz
    mv gitleaks ~/.local/bin/
    rm -f gitleaks.tar.gz
fi

# Install trivy
if ! check_tool trivy; then
    echo "📦 Installing trivy..."
    curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b ~/.local/bin
fi

# Install kubeval and conftest via go
if ! check_tool kubeval; then
    echo "📦 Installing kubeval..."
    go install github.com/instrumenta/kubeval@latest
fi

if ! check_tool conftest; then
    echo "📦 Installing conftest..."
    go install github.com/open-policy-agent/conftest@latest
fi

# Add paths to bashrc if not already present
if ! grep -q 'export PATH="$HOME/.local/bin:$PATH"' ~/.bashrc; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
fi

if ! grep -q 'export PATH="$HOME/go/bin:$PATH"' ~/.bashrc; then
    echo 'export PATH="$HOME/go/bin:$PATH"' >> ~/.bashrc
fi

# Source the updated PATH
export PATH="$HOME/go/bin:$PATH"

echo ""
echo "✅ All security tools installed successfully!"
echo ""
echo "Installed tools:"
echo "- semgrep: $(semgrep --version | head -1)"
echo "- gitleaks: $(gitleaks version)"
echo "- trivy: $(trivy version | head -1)"
echo "- kubeval: $(kubeval --version)"
echo "- conftest: $(conftest --version | head -1)"
echo ""
echo "🔄 Please restart your shell or run 'source ~/.bashrc' to update PATH"
echo "🚀 Run 'npm run validate:security' to test all security tools"
