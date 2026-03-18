---
title: "KubeStudio: Cluster Connectivity"
description: Troubleshooting connection refused errors, kubeconfig problems, VPN/firewall issues, and TLS/cert errors.
nav_order: 8
parent: "KubeStudio"
---

This guide covers common issues connecting KubeStudio to Kubernetes clusters.

## "Connection refused" for cluster

**Symptom:** KubeStudio shows a connection error when trying to reach the cluster API server.

**Possible causes:**

- The cluster is down or the API server isn't running.
- The kubeconfig points to an unreachable address.
- A VPN is required but not connected.

**Debugging:**

```bash
# Test cluster connectivity
kubectl cluster-info

# Check the API server address in your kubeconfig
kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'

# Test direct connectivity
curl -k $(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')/healthz
```

## Kubeconfig problems

**Symptom:** KubeStudio can't find the cluster or uses the wrong context.

**Possible causes:**

- **Default kubeconfig not found** — `~/.kube/config` doesn't exist.
- **Wrong context selected** — The active context points to a different cluster.
- **Stale credentials** — Token or certificate has expired.

**Debugging:**

```bash
# List available contexts
kubectl config get-contexts

# Check current context
kubectl config current-context

# Switch context
kubectl config use-context <context-name>

# Verify credentials work
kubectl auth whoami
```

> **Tip:** If your kubeconfig uses token-based auth (e.g., EKS, GKE), credentials may expire. Re-run the provider's CLI to refresh:
> 
> ```bash
> # AWS EKS
> aws eks update-kubeconfig --name my-cluster
> 
> # Google GKE
> gcloud container clusters get-credentials my-cluster
> ```
## VPN and firewall issues

**Symptom:** KubeStudio times out when connecting to the cluster.

**Possible causes:**

- A VPN connection is required to reach the cluster's private network.
- A firewall is blocking outbound connections to the API server port (usually `6443`).
- A network proxy is required but not configured.

**Debugging:**

```bash
# Check if the API server port is reachable
nc -zv <api-server-host> 6443

# Check for proxy settings
echo $HTTPS_PROXY $HTTP_PROXY $NO_PROXY

# Trace the network path
traceroute <api-server-host>
```

## TLS and certificate errors

**Symptom:** Connection fails with TLS handshake errors or certificate validation failures.

**Possible causes:**

- **Self-signed CA** — The cluster uses a private CA that isn't in the system trust store.
- **Expired certificate** — The cluster's serving certificate has expired.
- **Wrong CA bundle** — The kubeconfig's `certificate-authority-data` doesn't match the cluster's CA.

**Debugging:**

```bash
# Check the certificate
openssl s_client -connect <api-server-host>:6443 -showcerts

# Verify the CA in kubeconfig matches
kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}' | base64 -d | openssl x509 -text -noout
```

> **Caution:** Avoid disabling TLS verification in production. If you're using a private CA, add it to your system trust store instead.
```bash
# Linux — add custom CA
sudo cp cluster-ca.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates

# macOS — add custom CA
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain cluster-ca.crt
```
