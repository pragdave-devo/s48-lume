---
title: Cluster Management
description: Navigate and manage Kubernetes clusters with KubeStudio.
nav_order: 5
parent: "KubeStudio"
---

KubeStudio provides a visual interface for browsing and managing Kubernetes clusters.

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/kubestudio/videos/cluster-management.mp4" type="video/mp4" />
</video>

## Switching Contexts

KubeStudio reads all contexts from your kubeconfig. Use the context selector in the UI to switch between clusters.

If you need to add a new context:

```bash
# Add a new cluster context
kubectl config set-context my-cluster \
  --cluster=my-cluster \
  --user=my-user \
  --namespace=default
```

Restart KubeStudio or refresh the UI to pick up the new context.

## Browsing Namespaces

The namespace selector filters all views to the selected namespace. Select "All Namespaces" to see resources across the entire cluster.

## Viewing Workloads

KubeStudio displays workloads grouped by type:

- **Deployments** — Desired state and current replicas
- **StatefulSets** — Ordered pod management
- **DaemonSets** — Node-level workloads
- **Jobs / CronJobs** — Batch and scheduled tasks
- **Pods** — Individual pod status, logs, and resource usage

Click any workload to see its details, including pod status, events, and YAML manifest.

## Pod Inspection

For each pod, KubeStudio shows:

- **Status** — Running, Pending, Failed, etc.
- **Containers** — Image, ports, resource requests/limits
- **Logs** — Streaming container logs
- **Events** — Kubernetes events related to the pod

## Health Monitoring

KubeStudio provides at-a-glance health indicators:

- **Node status** — Ready, NotReady, or SchedulingDisabled
- **Pod phase** — Color-coded status for quick scanning
- **Resource usage** — CPU and memory against requests/limits
