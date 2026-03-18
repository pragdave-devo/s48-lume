---
title: "KubeStudio: Workload Issues"
description: Troubleshooting pods stuck Pending, scaling failures, logs not streaming, and stale UI data.
nav_order: 10
parent: "KubeStudio"
---

This guide covers common issues when viewing and managing workloads in KubeStudio.

## Pods stuck in Pending

**Symptom:** KubeStudio shows pods with a `Pending` status that don't transition to `Running`.

**Possible causes:**

- **Insufficient resources** — The cluster doesn't have enough CPU or memory to schedule the pod.
- **No matching nodes** — Node selectors, affinity rules, or taints prevent scheduling.
- **PVC not bound** — A PersistentVolumeClaim is waiting for a volume.

**Debugging:**

```bash
# Check pod events for scheduling failures
kubectl describe pod <pod-name> -n <namespace>

# Check node resources
kubectl describe nodes | grep -A 5 "Allocated resources"

# Check PVC status
kubectl get pvc -n <namespace>
```

Look for events like:

```
0/3 nodes are available: insufficient memory
0/3 nodes are available: node(s) didn't match Pod's node affinity
```

> **Note:** KubeStudio displays pod events in the pod detail view. Check there first before switching to the terminal.
## Scaling deployment fails

**Symptom:** Changing the replica count in KubeStudio doesn't take effect, or shows an error.

**Possible causes:**

- **Missing RBAC permissions** — The user doesn't have `update` on `deployments/scale`.
- **HPA active** — A HorizontalPodAutoscaler is overriding the manual replica count.
- **Resource quota exceeded** — The namespace's ResourceQuota prevents adding more pods.

**Debugging:**

```bash
# Check permissions
kubectl auth can-i update deployments/scale -n <namespace>

# Check for HPA
kubectl get hpa -n <namespace>

# Check resource quotas
kubectl describe resourcequota -n <namespace>
```

> **Tip:** If an HPA is managing the deployment, manual scaling will be overridden on the next reconciliation cycle. Adjust the HPA's `minReplicas`/`maxReplicas` instead.
## Logs not streaming

**Symptom:** The log viewer is empty or shows "No logs available" for a running pod.

**Possible causes:**

- **Missing `pods/log` permission** — The user can view pods but can't read their logs.
- **Container hasn't started** — The container is still in `ContainerCreating` state.
- **Multi-container pod** — The wrong container is selected (KubeStudio defaults to the first container).
- **Pod restarted** — Previous container logs may be lost if not using `--previous`.

**Debugging:**

```bash
# Check log permissions
kubectl auth can-i get pods/log -n <namespace>

# Test log streaming directly
kubectl logs <pod-name> -n <namespace> -f

# For multi-container pods, specify the container
kubectl logs <pod-name> -n <namespace> -c <container-name>

# View previous container logs (after a restart)
kubectl logs <pod-name> -n <namespace> --previous
```

## Stale data in the UI

**Symptom:** KubeStudio shows outdated information — pods that have been deleted still appear, or status doesn't update.

**Possible causes:**

- **Watch connection dropped** — The Kubernetes watch stream was interrupted and hasn't reconnected.
- **API server lag** — The API server's cache hasn't caught up (rare, usually in very large clusters).

**Debugging:**

```bash
# Check KubeStudio's watch connections
RUST_LOG=kube=debug cargo run -p ks-connector
```

Look for watch reconnection messages:

```
kube::watcher: watch connection reset, reconnecting
kube::watcher: watch resumed resource_version="..."
```

If watches aren't reconnecting, restart KubeStudio. If the problem persists, check your cluster's API server health.
