---
title: "Helm Chart"
description: "Install KubeStudio using the official Helm chart."
nav_order: 4
parent: "KubeStudio"
---

KubeStudio is distributed as a Helm chart and is available via both a Helm repository and an OCI registry.

## Helm Repository

Add the KubeStudio Helm repository and install:

```bash
helm repo add kubestudio https://strike48-public.github.io/kubestudio
helm repo update
helm install kubestudio kubestudio/kubestudio
```

Browse available chart versions on the [Helm chart pages](https://strike48-public.github.io/kubestudio).

## OCI Registry

Alternatively, install directly from the OCI registry:

```bash
helm install kubestudio oci://ghcr.io/strike48-public/kubestudio
```

## Environment Configuration

KubeStudio connects to your Strike48 Studio instance using environment variables. You can find these values in the **Gateway Configuration** page in Strike48 Studio.

![Gateway Configuration showing tenant ID](/assets/img/shared/gateway-configuration.png)

Create a `values.yaml` with your connector settings:

```yaml
image:
  tag: "latest"

connector:
  strikeUrl: "grpcs://connectors-YOUR_INSTANCE.strike48.com"
  tenantId: "your-tenant-uuid"
  instanceId: "your-instance-id"
  tls: true
  matrixApiUrl: "https://YOUR_INSTANCE.strike48.com/"
```

Or pass them inline with `--set`:

```bash
helm install kubestudio kubestudio/kubestudio \
  --set image.tag="latest" \
  --set connector.strikeUrl="grpcs://connectors-YOUR_INSTANCE.strike48.com" \
  --set connector.tenantId="your-tenant-uuid" \
  --set connector.instanceId="your-instance-id" \
  --set connector.tls=true \
  --set connector.matrixApiUrl="https://YOUR_INSTANCE.strike48.com/"
```

| Value | Description |
|---|---|
| `image.tag` | Container image version to deploy |
| `connector.strikeUrl` | gRPC endpoint for the connector gateway |
| `connector.tenantId` | Your organization's tenant UUID |
| `connector.instanceId` | Unique identifier for this deployment |
| `connector.tls` | Enable TLS for gRPC connections |
| `connector.matrixApiUrl` | Base URL of your Strike48 Studio instance |

## Common Options

Override default values with `--set` or a values file:

```bash
helm install kubestudio kubestudio/kubestudio \
  --namespace kubestudio \
  --create-namespace \
  --values values.yaml
```

## Upgrading

```bash
helm repo update
helm upgrade kubestudio kubestudio/kubestudio
```

## Uninstalling

```bash
helm uninstall kubestudio
```
