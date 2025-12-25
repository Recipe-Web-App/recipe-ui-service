#!/bin/bash
# scripts/containerManagement/cleanup-container.sh

set -euo pipefail

NAMESPACE="recipe-ui"
IMAGE_NAME="recipe-ui-service"
IMAGE_TAG="latest"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"

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

echo "🧹 Cleaning up Recipe UI Service resources..."
print_separator "="

# Check if minikube is running
if ! minikube status >/dev/null 2>&1; then
    print_status "error" "Minikube is not running. Please start it first with: minikube start"
    exit 1
fi
print_status "ok" "Minikube is running"

print_separator
echo -e "${CYAN}🛑 Deleting deployment...${NC}"
kubectl delete deployment recipe-ui-service -n "$NAMESPACE" --ignore-not-found
print_status "ok" "Deployment deletion completed"

print_separator
echo -e "${CYAN}🌐 Deleting service...${NC}"
kubectl delete service recipe-ui-service -n "$NAMESPACE" --ignore-not-found
print_status "ok" "Service deletion completed"

print_separator
echo -e "${CYAN}📥 Deleting ingress...${NC}"
kubectl delete ingress recipe-ui-ingress -n "$NAMESPACE" --ignore-not-found
print_status "ok" "Ingress deletion completed"

print_separator
echo -e "${CYAN}🚪 Deleting HTTPRoute (Kong Gateway)...${NC}"
kubectl delete httproute recipe-ui-ingress-recipe-ui-local -n "$NAMESPACE" --ignore-not-found
print_status "ok" "HTTPRoute deletion completed"

print_separator
echo -e "${CYAN}🔒 Deleting network policy...${NC}"
kubectl delete networkpolicy recipe-ui-network-policy -n "$NAMESPACE" --ignore-not-found
print_status "ok" "Network policy deletion completed"

print_separator
echo -e "${CYAN}⚙️  Deleting configmap...${NC}"
kubectl delete configmap recipe-ui-config -n "$NAMESPACE" --ignore-not-found
print_status "ok" "ConfigMap deletion completed"

print_separator
echo -e "${CYAN}🔐 Deleting secret...${NC}"
kubectl delete secret recipe-ui-secrets -n "$NAMESPACE" --ignore-not-found
print_status "ok" "Secret deletion completed"

print_separator
echo -e "${CYAN}📂 Deleting namespace...${NC}"
kubectl delete namespace "$NAMESPACE" --ignore-not-found
print_status "ok" "Namespace deletion completed"

print_separator
echo -e "${CYAN}🔗 Removing /etc/hosts entry...${NC}"
if grep -q "recipe-ui.local" /etc/hosts; then
  sed -i "/recipe-ui.local/d" /etc/hosts
  print_status "ok" "Removed recipe-ui.local from /etc/hosts"
else
  print_status "ok" "/etc/hosts entry was not found"
fi

print_separator
echo -e "${CYAN}🐳 Cleaning up Docker image...${NC}"
eval "$(minikube docker-env)"

if docker images -q "$FULL_IMAGE_NAME" >/dev/null 2>&1; then
    docker rmi "$FULL_IMAGE_NAME" >/dev/null 2>&1
    print_status "ok" "Docker image '$FULL_IMAGE_NAME' removed"
else
    print_status "ok" "Docker image '$FULL_IMAGE_NAME' was not found"
fi

print_separator "="
print_status "ok" "Cleanup completed successfully!"
