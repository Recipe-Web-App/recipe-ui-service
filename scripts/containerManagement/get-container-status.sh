#!/bin/bash
# scripts/containerManagement/get-container-status.sh

set -euo pipefail

NAMESPACE="recipe-ui"

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
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

# Function to print separator
print_separator() {
    local char="${1:-─}"
    local width="${2:-$(tput cols 2>/dev/null || echo 80)}"
    printf "%*s\n" "$width" '' | tr ' ' "$char"
}

# Function to test HTTP endpoint with timing
test_endpoint() {
    local url="$1"
    local description="$2"
    local timeout="${3:-5}"

    echo -e "${BLUE}  Testing: $description${NC}"

    if command_exists curl; then
        local response
        response=$(curl -s -w "%{http_code},%{time_total}" -m "$timeout" "$url" 2>/dev/null || echo "000,0.000")

        local http_code
        http_code=$(echo "$response" | tail -1 | cut -d',' -f1)
        local response_time
        response_time=$(echo "$response" | tail -1 | cut -d',' -f2)
        local body
        body=$(echo "$response" | head -n -1)

        if [ "$http_code" = "200" ]; then
            echo -e "    ✅ ${GREEN}HTTP $http_code${NC} - Response time: ${response_time}s"
            if echo "$body" | jq . >/dev/null 2>&1; then
                local status
                status=$(echo "$body" | jq -r '.status // empty')
                if [ -n "$status" ]; then
                    echo -e "    📊 Status: ${GREEN}$status${NC}"
                fi
            fi
        elif [ "$http_code" = "503" ]; then
            echo -e "    ⚠️  ${YELLOW}HTTP $http_code${NC} - Service unavailable - Response time: ${response_time}s"
        elif [ "$http_code" = "000" ]; then
            echo -e "    ❌ ${RED}Connection failed${NC} - Timeout or unreachable"
        else
            echo -e "    ❌ ${RED}HTTP $http_code${NC} - Response time: ${response_time}s"
        fi
    else
        echo -e "    ⚠️  ${YELLOW}curl not available - cannot test endpoint${NC}"
    fi
}

# Function to get health data from endpoint
get_health_data() {
    local url="$1"
    if command_exists curl; then
        curl -s -m 3 "$url" 2>/dev/null | jq . 2>/dev/null || echo "{}"
    else
        echo "{}"
    fi
}

echo "📊 Recipe UI Service Status Dashboard"
print_separator "="

# Check prerequisites
echo ""
echo -e "${CYAN}🔧 Prerequisites Check:${NC}"
for cmd in kubectl minikube curl jq; do
    if command_exists "$cmd"; then
        print_status "ok" "$cmd is available"
    else
        print_status "warning" "$cmd is not installed"
    fi
done

if command_exists minikube; then
    if minikube status >/dev/null 2>&1; then
        print_status "ok" "minikube is running"
    else
        print_status "warning" "minikube is not running"
    fi
fi

print_separator
echo ""
echo -e "${CYAN}🔍 Namespace Status:${NC}"
if kubectl get namespace "$NAMESPACE" >/dev/null 2>&1; then
    print_status "ok" "Namespace '$NAMESPACE' exists"
    NAMESPACE_AGE=$(kubectl get namespace "$NAMESPACE" -o jsonpath='{.metadata.creationTimestamp}' | xargs -I {} date -d {} "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "unknown")
    RESOURCE_COUNT=$(kubectl get all -n "$NAMESPACE" --no-headers 2>/dev/null | wc -l || echo "unknown")
    echo "   📅 Created: $NAMESPACE_AGE, Resources: $RESOURCE_COUNT"
else
    print_status "error" "Namespace '$NAMESPACE' does not exist"
    echo -e "${YELLOW}💡 Run ./scripts/containerManagement/deploy-container.sh to deploy${NC}"
    exit 1
fi

print_separator
echo ""
echo -e "${CYAN}📦 Deployment Status:${NC}"
if kubectl get deployment recipe-ui-service -n "$NAMESPACE" >/dev/null 2>&1; then
    kubectl get deployment recipe-ui-service -n "$NAMESPACE"

    READY_REPLICAS=$(kubectl get deployment recipe-ui-service -n "$NAMESPACE" -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
    DESIRED_REPLICAS=$(kubectl get deployment recipe-ui-service -n "$NAMESPACE" -o jsonpath='{.spec.replicas}' 2>/dev/null || echo "0")

    if [ "$READY_REPLICAS" = "$DESIRED_REPLICAS" ] && [ "$READY_REPLICAS" != "0" ]; then
        print_status "ok" "Deployment is ready ($READY_REPLICAS/$DESIRED_REPLICAS replicas)"
    else
        print_status "warning" "Deployment not fully ready ($READY_REPLICAS/$DESIRED_REPLICAS replicas)"
    fi
else
    print_status "error" "Deployment not found"
fi

print_separator
echo ""
echo -e "${CYAN}🐳 Pod Status:${NC}"
if kubectl get pods -n "$NAMESPACE" -l app=recipe-ui-service >/dev/null 2>&1; then
    kubectl get pods -n "$NAMESPACE" -l app=recipe-ui-service

    POD_NAME=$(kubectl get pods -n "$NAMESPACE" -l app=recipe-ui-service -o jsonpath="{.items[0].metadata.name}" 2>/dev/null || echo "")
    if [ -n "$POD_NAME" ]; then
        echo ""
        echo -e "${CYAN}📋 Pod Details:${NC}"
        kubectl describe pod "$POD_NAME" -n "$NAMESPACE" | grep -A5 -E "Conditions:|Events:" || true
    fi
else
    print_status "error" "No pods found"
fi

print_separator
echo ""
echo -e "${CYAN}🏥 Multi-Tier Health Check Dashboard:${NC}"
if command_exists minikube && minikube status >/dev/null 2>&1; then
    MINIKUBE_IP=$(minikube ip 2>/dev/null || echo "unknown")

    if [ "$MINIKUBE_IP" != "unknown" ]; then
        echo -e "${PURPLE}🔍 Testing all health endpoints...${NC}"

        # Test main health endpoint
        test_endpoint "http://recipe-ui.local/api/v1/recipe-ui/health" "General Health Endpoint" 5

        # Test readiness endpoint
        test_endpoint "http://recipe-ui.local/api/v1/recipe-ui/health/ready" "Readiness Probe" 3

        # Test liveness endpoint
        test_endpoint "http://recipe-ui.local/api/v1/recipe-ui/health/live" "Liveness Probe" 3

        # Test metrics endpoint
        test_endpoint "http://recipe-ui.local/api/v1/recipe-ui/metrics" "Prometheus Metrics" 3

        echo ""
        echo -e "${PURPLE}📊 Detailed Health Analysis:${NC}"
        HEALTH_DATA=$(get_health_data "http://recipe-ui.local/api/v1/recipe-ui/health")
        if [ "$HEALTH_DATA" != "{}" ]; then
            echo "$HEALTH_DATA" | jq -r '
                "  🕐 Uptime: " + (.uptime // "unknown"),
                "  💾 Memory: " + (.memory.heapUsed // "unknown") + "/" + (.memory.heapTotal // "unknown") + " (" + (.memory.usagePercent // "unknown") + ")",
                "  🖥️  CPU User: " + (.cpu.user // "unknown") + " System: " + (.cpu.system // "unknown"),
                "  🏷️  Environment: " + (.environment // "unknown"),
                "  📱 Version: " + (.version // "unknown"),
                "  🏠 Hostname: " + (.hostname // "unknown")'
        else
            echo -e "  ⚠️  ${YELLOW}Health data not available${NC}"
        fi
    fi
else
    print_status "warning" "Cannot test health endpoints - Minikube IP not available"
fi

print_separator
echo ""
echo -e "${CYAN}🌐 Service Status:${NC}"
if kubectl get service recipe-ui-service -n "$NAMESPACE" >/dev/null 2>&1; then
    kubectl get service recipe-ui-service -n "$NAMESPACE"
    print_status "ok" "Service is available"
else
    print_status "error" "Service not found"
fi

print_separator
echo ""
echo -e "${CYAN}📥 Ingress Status:${NC}"
if kubectl get ingress recipe-ui-ingress -n "$NAMESPACE" >/dev/null 2>&1; then
    kubectl get ingress recipe-ui-ingress -n "$NAMESPACE"

    INGRESS_IP=$(kubectl get ingress recipe-ui-ingress -n "$NAMESPACE" -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    if [ -n "$INGRESS_IP" ]; then
        print_status "ok" "Ingress has IP: $INGRESS_IP"
    else
        print_status "warning" "Ingress IP not yet assigned"
    fi
else
    print_status "error" "Ingress not found"
fi

print_separator
echo ""
echo -e "${CYAN}🔐 ConfigMap and Secret Status:${NC}"
if kubectl get configmap recipe-ui-config -n "$NAMESPACE" >/dev/null 2>&1; then
    print_status "ok" "ConfigMap exists"
    CONFIG_KEYS=$(kubectl get configmap recipe-ui-config -n "$NAMESPACE" -o jsonpath='{.data}' | jq -r 'keys[]' 2>/dev/null | wc -l || echo "0")
    echo "   🔑 Configuration keys: $CONFIG_KEYS"
else
    print_status "error" "ConfigMap not found"
fi

if kubectl get secret recipe-ui-secrets -n "$NAMESPACE" >/dev/null 2>&1; then
    print_status "ok" "Secret exists"
    SECRET_KEYS=$(kubectl get secret recipe-ui-secrets -n "$NAMESPACE" -o jsonpath='{.data}' | jq -r 'keys[]' 2>/dev/null | wc -l || echo "0")
    echo "   🔐 Secret keys: $SECRET_KEYS"
else
    print_status "error" "Secret not found"
fi

print_separator
echo ""
echo -e "${CYAN}🔒 Security Posture Check:${NC}"
if [ -n "$POD_NAME" ]; then
    echo -e "${BLUE}  Checking pod security context...${NC}"

    RUN_AS_NON_ROOT=$(kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.securityContext.runAsNonRoot}' 2>/dev/null || echo "false")
    READ_ONLY_ROOT=$(kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.containers[0].securityContext.readOnlyRootFilesystem}' 2>/dev/null || echo "false")
    RUN_AS_USER=$(kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.containers[0].securityContext.runAsUser}' 2>/dev/null || echo "unknown")

    if [ "$RUN_AS_NON_ROOT" = "true" ]; then
        print_status "ok" "Running as non-root user (UID: $RUN_AS_USER)"
    else
        print_status "warning" "Not explicitly set to run as non-root"
    fi

    if [ "$READ_ONLY_ROOT" = "true" ]; then
        print_status "ok" "Read-only root filesystem enabled"
    else
        print_status "warning" "Read-only root filesystem not enabled"
    fi
fi

# Check network policy
if kubectl get networkpolicy recipe-ui-network-policy -n "$NAMESPACE" >/dev/null 2>&1; then
    print_status "ok" "Network policy is active"
else
    print_status "warning" "Network policy not found"
fi

print_separator
echo ""
echo -e "${CYAN}🌐 Frontend Route Testing:${NC}"
if command_exists minikube && minikube status >/dev/null 2>&1; then
    echo -e "${BLUE}  Testing key application routes...${NC}"

    # Test homepage
    test_endpoint "http://recipe-ui.local/" "Homepage" 10

    # Test API routes
    test_endpoint "http://recipe-ui.local/api/v1/recipe-ui/health" "Health API" 5

    echo ""
    echo -e "${BLUE}  Testing static asset availability...${NC}"
    if command_exists curl; then
        STATIC_TEST=$(curl -s -I -m 3 "http://recipe-ui.local/_next/static/" 2>/dev/null | head -1 || echo "")
        if echo "$STATIC_TEST" | grep -q "200\|403\|404"; then
            print_status "ok" "Static asset server responding"
        else
            print_status "warning" "Static asset server may not be accessible"
        fi
    fi
fi

print_separator
echo ""
echo -e "${CYAN}💾 Resource Usage Analysis:${NC}"
if kubectl top pods -n "$NAMESPACE" --no-headers 2>/dev/null | grep -q recipe-ui-service; then
    echo -e "${BLUE}  Current resource usage:${NC}"
    kubectl top pods -n "$NAMESPACE" --no-headers | grep recipe-ui-service

    # Get resource limits for comparison
    if [ -n "$POD_NAME" ]; then
        echo ""
        echo -e "${BLUE}  Resource limits vs usage:${NC}"
        CPU_LIMIT=$(kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.containers[0].resources.limits.cpu}' 2>/dev/null || echo "unknown")
        MEMORY_LIMIT=$(kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.containers[0].resources.limits.memory}' 2>/dev/null || echo "unknown")
        CPU_REQUEST=$(kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.containers[0].resources.requests.cpu}' 2>/dev/null || echo "unknown")
        MEMORY_REQUEST=$(kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.containers[0].resources.requests.memory}' 2>/dev/null || echo "unknown")

        echo "    💾 Memory: Request: $MEMORY_REQUEST, Limit: $MEMORY_LIMIT"
        echo "    🖥️  CPU: Request: $CPU_REQUEST, Limit: $CPU_LIMIT"
    fi
else
    print_status "warning" "Metrics not available (metrics-server may not be installed)"
fi

print_separator
echo ""
echo -e "${CYAN}🔗 Backend Service Connectivity Matrix:${NC}"
if command_exists minikube && minikube status >/dev/null 2>&1; then
    echo -e "${BLUE}  Testing backend service connectivity...${NC}"

    # These would be configured in your ConfigMap
    declare -A BACKEND_SERVICES=(
        ["Recipe Service"]="recipe-service.recipe-manager.svc.cluster.local:3000"
        ["User Service"]="user-service.user-management.svc.cluster.local:3000"
        ["Meal Plan Service"]="meal-plan-management-service.meal-plan-management.svc.cluster.local:3000"
    )

    for service_name in "${!BACKEND_SERVICES[@]}"; do
        service_url="${BACKEND_SERVICES[$service_name]}"
        echo -e "${BLUE}  Testing: $service_name${NC}"

        if command_exists curl && [ -n "$POD_NAME" ]; then
            # Test from inside the pod to check service-to-service connectivity
            CONNECTIVITY_TEST=$(kubectl exec "$POD_NAME" -n "$NAMESPACE" -- curl -s -m 3 -w "%{http_code}" "http://$service_url/health" 2>/dev/null || echo "000")
            if [ "$CONNECTIVITY_TEST" = "200" ]; then
                print_status "ok" "$service_name is reachable"
            elif [ "$CONNECTIVITY_TEST" = "000" ]; then
                print_status "warning" "$service_name not reachable (may be down or misconfigured)"
            else
                print_status "warning" "$service_name returned HTTP $CONNECTIVITY_TEST"
            fi
        else
            print_status "warning" "Cannot test $service_name - pod not available or curl missing"
        fi
    done
fi

print_separator
echo ""
echo -e "${CYAN}📈 Performance & Memory Analysis:${NC}"
if command_exists minikube && minikube status >/dev/null 2>&1; then
    HEALTH_DATA=$(get_health_data "http://recipe-ui.local/api/v1/recipe-ui/health")

    if [ "$HEALTH_DATA" != "{}" ]; then
        echo -e "${BLUE}  Next.js Performance Metrics:${NC}"

        # Memory analysis
        MEMORY_PERCENT=$(echo "$HEALTH_DATA" | jq -r '.memory.usagePercent // "unknown"' | sed 's/%//')
        if [ "$MEMORY_PERCENT" != "unknown" ] && [ "$MEMORY_PERCENT" -gt 80 ]; then
            print_status "warning" "High memory usage: ${MEMORY_PERCENT}%"
        elif [ "$MEMORY_PERCENT" != "unknown" ]; then
            print_status "ok" "Memory usage: ${MEMORY_PERCENT}%"
        fi

        # Uptime analysis
        UPTIME=$(echo "$HEALTH_DATA" | jq -r '.uptime // "unknown"')
        echo "    ⏰ Uptime: $UPTIME"

        # Environment validation
        ENV=$(echo "$HEALTH_DATA" | jq -r '.environment // "unknown"')
        if [ "$ENV" = "production" ]; then
            print_status "ok" "Running in production mode"
        else
            print_status "warning" "Not running in production mode: $ENV"
        fi
    fi
fi

print_separator
echo ""
echo -e "${CYAN}🔗 Access Information:${NC}"
if command_exists minikube && minikube status >/dev/null 2>&1; then
    MINIKUBE_IP=$(minikube ip 2>/dev/null || echo "unknown")
    echo "🔗 Minikube IP: $MINIKUBE_IP"

    if grep -q "recipe-ui.local" /etc/hosts 2>/dev/null; then
        print_status "ok" "/etc/hosts entry exists for recipe-ui.local"
        echo "🌍 Application URLs:"
        echo "   • Frontend: http://recipe-ui.local/"
        echo "   • Health: http://recipe-ui.local/api/v1/recipe-ui/health"
        echo "   • Ready: http://recipe-ui.local/api/v1/recipe-ui/health/ready"
        echo "   • Live: http://recipe-ui.local/api/v1/recipe-ui/health/live"
        echo "   • Metrics: http://recipe-ui.local/api/v1/recipe-ui/metrics"
    else
        print_status "warning" "/etc/hosts entry missing. Add: $MINIKUBE_IP recipe-ui.local"
    fi
fi

# Get service cluster IP
if kubectl get service recipe-ui-service -n "$NAMESPACE" >/dev/null 2>&1; then
    SERVICE_IP=$(kubectl get service recipe-ui-service -n "$NAMESPACE" -o jsonpath='{.spec.clusterIP}' 2>/dev/null || echo "unknown")
    SERVICE_PORT=$(kubectl get service recipe-ui-service -n "$NAMESPACE" -o jsonpath='{.spec.ports[0].port}' 2>/dev/null || echo "unknown")
    echo "🔗 Service ClusterIP: $SERVICE_IP:$SERVICE_PORT"
fi

print_separator
echo ""
echo -e "${CYAN}🛡️  Security Validation:${NC}"
if [ -n "$POD_NAME" ]; then
    echo -e "${BLUE}  Container security checks:${NC}"

    # Check capabilities
    CAPABILITIES=$(kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.containers[0].securityContext.capabilities.drop}' 2>/dev/null || echo "[]")
    if echo "$CAPABILITIES" | grep -q "ALL"; then
        print_status "ok" "All capabilities dropped"
    else
        print_status "warning" "Capabilities not fully restricted"
    fi

    # Check privilege escalation
    ALLOW_PRIV_ESC=$(kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.containers[0].securityContext.allowPrivilegeEscalation}' 2>/dev/null || echo "true")
    if [ "$ALLOW_PRIV_ESC" = "false" ]; then
        print_status "ok" "Privilege escalation disabled"
    else
        print_status "warning" "Privilege escalation not disabled"
    fi
fi

print_separator
echo ""
echo -e "${CYAN}📜 Recent Events & Troubleshooting:${NC}"
echo -e "${BLUE}  Recent pod events:${NC}"
kubectl get events -n "$NAMESPACE" --sort-by='.lastTimestamp' --field-selector involvedObject.kind=Pod | tail -5 || print_status "warning" "No recent events found"

if [ -n "$POD_NAME" ]; then
    echo ""
    echo -e "${BLUE}  Container logs (last 10 lines):${NC}"
    kubectl logs "$POD_NAME" -n "$NAMESPACE" --tail=10 2>/dev/null || print_status "warning" "Logs not available"

    echo ""
    echo -e "${BLUE}  Container restart count:${NC}"
    RESTART_COUNT=$(kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.status.containerStatuses[0].restartCount}' 2>/dev/null || echo "unknown")
    if [ "$RESTART_COUNT" = "0" ]; then
        print_status "ok" "No restarts: $RESTART_COUNT"
    elif [ "$RESTART_COUNT" != "unknown" ] && [ "$RESTART_COUNT" -lt 3 ]; then
        print_status "warning" "Low restart count: $RESTART_COUNT"
    else
        print_status "error" "High restart count: $RESTART_COUNT"
    fi
fi

print_separator "="
echo -e "${GREEN}📊 Status check completed!${NC}"
echo -e "${CYAN}💡 Quick actions:${NC}"
echo "   🚀 Start: ./scripts/containerManagement/start-container.sh"
echo "   🛑 Stop: ./scripts/containerManagement/stop-container.sh"
echo "   🔄 Update: ./scripts/containerManagement/update-container.sh"
echo "   🧹 Cleanup: ./scripts/containerManagement/cleanup-container.sh"
print_separator "="
