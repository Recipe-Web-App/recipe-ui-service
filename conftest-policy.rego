# Conftest policies for Kubernetes manifest security validation
# Open Policy Agent (OPA) rules for container and Kubernetes security

package main

import rego.v1

# Deny containers running as root
deny contains msg if {
    input.kind == "Deployment"
    input.spec.template.spec.securityContext.runAsUser == 0
    msg := "Containers must not run as root user (UID 0)"
}

# Deny containers without resource limits
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.resources.limits
    msg := sprintf("Container '%s' must have resource limits defined", [container.name])
}

# Deny containers without resource requests
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.resources.requests
    msg := sprintf("Container '%s' must have resource requests defined", [container.name])
}

# Deny privileged containers
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    container.securityContext.privileged == true
    msg := sprintf("Container '%s' must not run in privileged mode", [container.name])
}

# Deny containers with allowPrivilegeEscalation
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    container.securityContext.allowPrivilegeEscalation == true
    msg := sprintf("Container '%s' must not allow privilege escalation", [container.name])
}

# Deny containers without readOnlyRootFilesystem
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.securityContext.readOnlyRootFilesystem == true
    msg := sprintf("Container '%s' should use read-only root filesystem", [container.name])
}

# Deny containers without liveness probe
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.livenessProbe
    msg := sprintf("Container '%s' must have a liveness probe", [container.name])
}

# Deny containers without readiness probe
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.readinessProbe
    msg := sprintf("Container '%s' must have a readiness probe", [container.name])
}

# Deny latest image tags
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    endswith(container.image, ":latest")
    msg := sprintf("Container '%s' must not use 'latest' image tag", [container.name])
}

# Deny containers without explicit image tags
deny contains msg if {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not contains(container.image, ":")
    msg := sprintf("Container '%s' must specify an explicit image tag", [container.name])
}

# Require NetworkPolicies for deployments
warn contains msg if {
    input.kind == "Deployment"
    msg := "Consider creating a NetworkPolicy to restrict network traffic"
}

# Require PodDisruptionBudget for production deployments
warn contains msg if {
    input.kind == "Deployment"
    input.spec.replicas > 1
    msg := "Consider creating a PodDisruptionBudget for high availability"
}
