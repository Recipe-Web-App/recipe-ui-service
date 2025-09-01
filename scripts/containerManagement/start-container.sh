#!/bin/bash
# scripts/containerManagement/start-container.sh

set -euo pipefail

NAMESPACE="recipe-ui"

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print separator
print_separator() {
    local char="${1:-─}"
    local width="${2:-$(tput cols 2>/dev/null || echo 80)}"
    printf "%*s\n" "$width" '' | tr ' ' "$char"
}

# Function to print status with color
print_status() {
    local status="$1"
    local message="$2"
    if [ "$status" = "ok" ]; then
        echo -e "✅ ${GREEN}$message${NC}"
    elif [ "$status" = "warning" ]; then
        echo -e "⚠️  ${YELLOW}$message${NC}"
    else
        echo -e "❌ ${RED}$message${NC}"
    fi
}

echo "🚀 Starting Recipe UI Service containers..."
print_separator "="

# Check if minikube is running
if ! minikube status >/dev/null 2>&1; then
    print_status "error" "Minikube is not running. Please start it first with: minikube start"
    exit 1
fi
print_status "ok" "Minikube is running"

print_separator
echo -e "${CYAN}📈 Scaling deployment to 1 replica...${NC}"
kubectl scale deployment recipe-ui-service --replicas=1 -n "$NAMESPACE"

print_separator
echo -e "${CYAN}⏳ Waiting for Recipe UI Service to be ready...${NC}"
kubectl wait --namespace="$NAMESPACE" \
  --for=condition=Ready pod \
  --selector=app=recipe-ui-service \
  --timeout=60s

print_separator "="
print_status "ok" "Recipe UI Service is now running"
echo -e "${CYAN}🌍 Access at: http://recipe-ui.local${NC}"
