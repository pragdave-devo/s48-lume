---
title: "KubeStudio: Permissions & RBAC"
description: Troubleshooting RBAC issues, namespace visibility, kubectl auth can-i, and minimum required permissions.
nav_order: 9
parent: "KubeStudio"
---

KubeStudio needs specific Kubernetes RBAC permissions to function. This guide covers permission-related issues and the minimum required access.

## Namespace list is empty

**Symptom:** KubeStudio shows no namespaces.

**Possible causes:**

- The current user/service account doesn't have `list` permission on namespaces.
- The cluster is still initializing (rare).

**Debugging:**

```bash
# Check if you can list namespaces
kubectl auth can-i list namespaces

# Try listing directly
kubectl get namespaces
```

If the answer is `no`, you need a ClusterRole that grants namespace list access.

## "Forbidden" errors for resources

**Symptom:** KubeStudio shows "Forbidden" or "403" when trying to view pods, deployments, or other resources.

**Possible causes:**

- The user only has access to specific namespaces, not cluster-wide.
- The Role/ClusterRole doesn't include the required verbs (`get`, `list`, `watch`).

**Debugging:**

```bash
# Check specific permissions
kubectl auth can-i list pods -n <namespace>
kubectl auth can-i get deployments -n <namespace>
kubectl auth can-i watch pods -n <namespace>

# List all permissions for the current user
kubectl auth can-i --list
```

## Minimum required permissions

KubeStudio needs the following permissions for full functionality:

| Resource | Verbs | Scope | Required for |
|----------|-------|-------|-------------|
| `namespaces` | `list` | Cluster | Namespace browser |
| `pods` | `get`, `list`, `watch` | Namespace | Pod listing, live updates |
| `pods/log` | `get` | Namespace | Log streaming |
| `deployments` | `get`, `list`, `watch` | Namespace | Deployment overview |
| `deployments/scale` | `update` | Namespace | Scaling deployments |
| `replicasets` | `get`, `list` | Namespace | Rollout history |
| `services` | `get`, `list` | Namespace | Service listing |
| `events` | `get`, `list`, `watch` | Namespace | Event stream |

## Sample ClusterRole

A minimal ClusterRole for KubeStudio read access:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubestudio-viewer
rules:
  - apiGroups: [""]
    resources: ["namespaces"]
    verbs: ["list"]
  - apiGroups: [""]
    resources: ["pods", "pods/log", "services", "events"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch"]
```

To also allow scaling deployments:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubestudio-operator
rules:
  - apiGroups: [""]
    resources: ["namespaces"]
    verbs: ["list"]
  - apiGroups: [""]
    resources: ["pods", "pods/log", "services", "events"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments/scale"]
    verbs: ["update"]
```

Bind the role to your user or service account:

```bash
kubectl create clusterrolebinding kubestudio-viewer-binding \
  --clusterrole=kubestudio-viewer \
  --user=your-user@example.com
```

> **Tip:** Use `kubectl auth can-i --list --namespace=<ns>` to see all permissions your current user has in a specific namespace.