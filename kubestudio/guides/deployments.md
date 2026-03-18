---
title: Deployments
description: Manage Kubernetes deployments with KubeStudio.
nav_order: 6
parent: "KubeStudio"
---

KubeStudio provides tools for viewing and managing Kubernetes Deployments.

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/kubestudio/videos/deployments.mp4" type="video/mp4" />
</video>

## Viewing Deployments

The Deployments view shows all deployments in the selected namespace with:

- **Name** — Deployment name
- **Replicas** — Desired vs. available replica count
- **Image** — Container image and tag
- **Age** — Time since creation
- **Status** — Healthy (all replicas available), progressing, or degraded

## Scaling

To scale a deployment:

1. Select the deployment from the list
2. Adjust the replica count in the details panel
3. Confirm the change

KubeStudio sends a patch to the Kubernetes API and updates the UI as pods come online.

## Rollout Management

View the rollout history for a deployment:

- **Revision history** — Each rollout revision with timestamp and change cause
- **Current revision** — Which revision is active
- **Rollback** — Revert to a previous revision

## Container Images

KubeStudio displays the container images used by each deployment. The image column shows:

- Registry and repository
- Tag or digest
- Whether the image pull policy is Always, IfNotPresent, or Never

## Labels and Selectors

View and filter deployments by labels. The details panel shows:

- **Labels** — Key-value pairs attached to the deployment
- **Selectors** — How the deployment selects its pods
- **Annotations** — Additional metadata

## YAML View

Toggle to the YAML view to see the full deployment manifest. This is read-only — for edits, use `kubectl` or your GitOps tooling.
