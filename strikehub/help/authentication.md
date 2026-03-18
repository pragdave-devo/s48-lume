---
title: "StrikeHub: Authentication"
description: Troubleshooting OIDC flow failures, token injection, Keycloak connectivity, and TLS issues.
nav_order: 9
parent: "StrikeHub"
---

StrikeHub uses OIDC (OpenID Connect) with Keycloak for authentication. This guide covers common auth-related issues.

## OIDC flow doesn't complete

**Symptom:** The sign-in flow opens the browser but never redirects back, or StrikeHub never receives the token.

**Possible causes:**

- **`STRIKE48_API_URL` not set** — The environment variable must point to the Prospector Studio API server.
- **Redirect URI mismatch** — The Keycloak client's allowed redirect URIs don't include StrikeHub's callback URL.
- **Browser blocked the popup** — Some browsers block the redirect back to `localhost`.

**Debugging:**

```bash
# Verify the API URL is set
echo $STRIKE48_API_URL

# Run with auth tracing
RUST_LOG=sh_core::auth=debug cargo run --features desktop
```

Look for log lines like:

```
sh_core::auth: starting OIDC flow redirect_uri="http://localhost:..."
sh_core::auth: OIDC callback error err="..."
```

> **Tip:** Check your Keycloak admin console to verify the client's **Valid Redirect URIs** include `http://localhost:*`.
## Token not injected into connector

**Symptom:** Authentication succeeds (you see the success page in the browser) but the connector UI shows "Not authenticated."

**Possible causes:**

- **Connector loaded before auth completed** — The iframe rendered before the token was available.
- **Token injection script error** — The `connector://` protocol handler failed to inject the token into the HTML.

**Debugging:**

```bash
RUST_LOG=sh_core::auth=debug,sh_core::proxy=debug cargo run --features desktop
```

Look for:

```
sh_core::auth: token received, injecting into connector HTML
sh_core::proxy: serving connector html connector="kubestudio" token_injected=true
```

If `token_injected=false`, the auth flow may not have completed before the connector was loaded. Try refreshing the connector (click its sidebar entry again).

## Keycloak server unreachable

**Symptom:** The sign-in button does nothing, or the browser shows a connection error.

**Possible causes:**

- The Keycloak server is down or unreachable from your network.
- DNS resolution failure for the Keycloak hostname.
- Firewall blocking outbound connections.

**Debugging:**

```bash
# Test direct connectivity
curl -v $STRIKE48_API_URL/.well-known/openid-configuration

# Check DNS
nslookup $(echo $STRIKE48_API_URL | sed 's|https\?://||' | cut -d/ -f1)
```

## TLS certificate errors

**Symptom:** Auth fails with TLS/SSL errors in the logs.

**Possible causes:**

- Self-signed certificate on the Keycloak server.
- Expired certificate.
- Corporate proxy intercepting TLS.

**Debugging:**

For local development with self-signed certs:

```bash
MATRIX_TLS_INSECURE=true cargo run --features desktop
```

> **Caution:** Never use `MATRIX_TLS_INSECURE=true` in production. It disables certificate validation entirely.
For production, ensure the CA certificate is installed in your system's trust store:

```bash
# Linux (Debian/Ubuntu)
sudo cp your-ca.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates

# macOS
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain your-ca.crt
```
