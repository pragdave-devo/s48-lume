---
title: Deploying Connectors
description: Production deployment strategies for Strike48 connectors including Docker, systemd, and Kubernetes.
nav_order: 10
parent: "For Developers"
---

This guide covers deploying Strike48 connectors to production environments. Learn about deployment strategies, configuration management, monitoring, and scaling patterns.

## Deployment Options

| Method | Best For | Complexity | Scaling |
|--------|----------|------------|---------|
| **Binary** | Single server, simple setup | Low | Manual |
| **systemd** | Linux servers, auto-restart | Medium | Manual |
| **Docker** | Containerized environments | Medium | Easy |
| **Kubernetes** | Distributed, cloud-native | High | Automatic |

## Building Release Binaries

### Optimized Release Build

```bash
# Build with optimizations
cargo build --release

# Binary location
ls -lh target/release/my-connector

# Strip symbols for smaller binary (optional)
strip target/release/my-connector
```

### Cross-Compilation

For deploying to different platforms:

```bash
# Install cross-compilation tool
cargo install cross

# Build for Linux (from macOS/Windows)
cross build --release --target x86_64-unknown-linux-musl

# Build for ARM64 (Raspberry Pi, AWS Graviton)
cross build --release --target aarch64-unknown-linux-musl
```

### Static Linking for Portability

Use musl for fully static binaries:

```toml
# .cargo/config.toml
[target.x86_64-unknown-linux-musl]
rustflags = ["-C", "target-feature=+crt-static"]
```

```bash
rustup target add x86_64-unknown-linux-musl
cargo build --release --target x86_64-unknown-linux-musl
```

## Configuration Management

### Environment Variables

```bash
# Production configuration
export MATRIX_HOST=connectors.strike48.com:443
export MATRIX_API_URL=https://api.strike48.com
export MATRIX_TENANT_ID=production
export INSTANCE_ID=scanner-prod-01
export RUST_LOG=info
export USE_TLS=true

# Run connector
./my-connector
```

### Configuration Files

Create `config.toml`:

```toml
[matrix]
host = "connectors.strike48.com:443"
api_url = "https://api.strike48.com"
tenant_id = "production"
use_tls = true

[connector]
instance_id = "scanner-prod-01"
max_concurrent_scans = 10
timeout_seconds = 300

[logging]
level = "info"
format = "json"
```

Load in code:

```rust
use serde::Deserialize;

#[derive(Deserialize)]
struct Config {
    matrix: MatrixConfig,
    connector: ConnectorConfig,
    logging: LoggingConfig,
}

fn load_config() -> Result<Config> {
    let config_path = std::env::var("CONFIG_PATH")
        .unwrap_or_else(|_| "/etc/my-connector/config.toml".to_string());

    let content = std::fs::read_to_string(config_path)?;
    let config: Config = toml::from_str(&content)?;

    Ok(config)
}
```

### Secrets Management

❌ **Bad**: Hardcoded secrets
```rust
let api_key = "sk-1234567890"; // Never do this!
```

✅ **Good**: Environment variables
```bash
export MATRIX_AUTH_TOKEN=$(cat /run/secrets/matrix-token)
```

✅ **Better**: Secrets manager
```rust
async fn load_auth_token() -> Result<String> {
    // AWS Secrets Manager
    let client = aws_secretsmanager::Client::new(&config);
    let secret = client
        .get_secret_value()
        .secret_id("matrix/auth-token")
        .send()
        .await?;

    Ok(secret.secret_string().unwrap().to_string())
}
```

## systemd Deployment

### Create Service Unit

Create `/etc/systemd/system/my-connector.service`:

```ini
[Unit]
Description=Strike48 Port Scanner Connector
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=connector
Group=connector
WorkingDirectory=/opt/my-connector

# Environment
Environment="MATRIX_HOST=connectors.strike48.com:443"
Environment="MATRIX_TENANT_ID=production"
Environment="INSTANCE_ID=scanner-prod-01"
Environment="RUST_LOG=info"
EnvironmentFile=-/etc/my-connector/env

# Binary
ExecStart=/opt/my-connector/bin/my-connector

# Restart policy
Restart=always
RestartSec=10
StartLimitBurst=3
StartLimitInterval=60

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/my-connector

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=my-connector

[Install]
WantedBy=multi-user.target
```

### Deploy and Manage

```bash
# Create user
sudo useradd -r -s /bin/false connector

# Create directories
sudo mkdir -p /opt/my-connector/bin
sudo mkdir -p /var/lib/my-connector
sudo mkdir -p /etc/my-connector

# Copy binary
sudo cp target/release/my-connector /opt/my-connector/bin/
sudo chown -R connector:connector /opt/my-connector
sudo chown -R connector:connector /var/lib/my-connector

# Install service
sudo cp my-connector.service /etc/systemd/system/
sudo systemctl daemon-reload

# Enable and start
sudo systemctl enable my-connector
sudo systemctl start my-connector

# Check status
sudo systemctl status my-connector
sudo journalctl -u my-connector -f
```

## Docker Deployment

### Dockerfile

Create multi-stage `Dockerfile`:

```dockerfile
# Build stage
FROM rust:1.76 as builder

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Copy source
COPY src ./src

# Build release binary
RUN cargo build --release --locked

# Runtime stage
FROM debian:bookworm-slim

# Install CA certificates and required libs
RUN apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Create app user
RUN useradd -r -u 1000 connector

# Copy binary from builder
COPY --from=builder /app/target/release/my-connector /usr/local/bin/connector

# Set ownership
RUN chown connector:connector /usr/local/bin/connector

# Switch to app user
USER connector

# Expose health check port (optional)
EXPOSE 8080

# Run
ENTRYPOINT ["/usr/local/bin/connector"]
```

### Minimal Alpine Image

For smaller images:

```dockerfile
# Build stage
FROM rust:1.76-alpine as builder

RUN apk add --no-cache musl-dev

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src

RUN cargo build --release --target x86_64-unknown-linux-musl

# Runtime stage
FROM alpine:latest

RUN apk add --no-cache ca-certificates

RUN adduser -D -u 1000 connector

COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/my-connector /usr/local/bin/connector

USER connector

ENTRYPOINT ["/usr/local/bin/connector"]
```

### Build and Run

```bash
# Build image
docker build -t my-connector:latest .

# Run container
docker run -d \
  --name my-connector \
  --restart unless-stopped \
  -e MATRIX_HOST=connectors.strike48.com:443 \
  -e MATRIX_TENANT_ID=production \
  -e INSTANCE_ID=scanner-docker-01 \
  -e RUST_LOG=info \
  my-connector:latest

# View logs
docker logs -f my-connector

# Check health
docker exec my-connector health-check
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  my-connector:
    build: .
    image: my-connector:latest
    container_name: my-connector
    restart: unless-stopped

    environment:
      MATRIX_HOST: connectors.strike48.com:443
      MATRIX_API_URL: https://api.strike48.com
      MATRIX_TENANT_ID: production
      INSTANCE_ID: scanner-compose-01
      RUST_LOG: info
      USE_TLS: "true"

    env_file:
      - .env.production

    volumes:
      - connector-data:/var/lib/connector

    # Health check
    healthcheck:
      test: ["CMD", "/usr/local/bin/connector", "health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

    # Logging
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  connector-data:
```

Run with:
```bash
docker-compose up -d
docker-compose logs -f
```

## Kubernetes Deployment

### Deployment Manifest

Create `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: port-scanner-connector
  namespace: strike48
  labels:
    app: port-scanner-connector
spec:
  replicas: 3
  selector:
    matchLabels:
      app: port-scanner-connector
  template:
    metadata:
      labels:
        app: port-scanner-connector
    spec:
      serviceAccountName: connector-sa

      containers:
      - name: connector
        image: myregistry.io/port-scanner-connector:v1.0.0
        imagePullPolicy: Always

        env:
        - name: MATRIX_HOST
          value: "connectors.strike48.com:443"
        - name: MATRIX_API_URL
          value: "https://api.strike48.com"
        - name: MATRIX_TENANT_ID
          value: "production"
        - name: INSTANCE_ID
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: RUST_LOG
          value: "info"
        - name: USE_TLS
          value: "true"

        # Secrets from Kubernetes Secrets
        - name: MATRIX_AUTH_TOKEN
          valueFrom:
            secretKeyRef:
              name: matrix-credentials
              key: auth-token

        ports:
        - name: health
          containerPort: 8080
          protocol: TCP

        # Health checks
        livenessProbe:
          httpGet:
            path: /health
            port: health
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3

        readinessProbe:
          httpGet:
            path: /ready
            port: health
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3

        # Resource limits
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
          limits:
            cpu: "2"
            memory: "1Gi"

        # Security context
        securityContext:
          runAsNonRoot: true
          runAsUser: 1000
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL

        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: config
          mountPath: /etc/connector
          readOnly: true

      volumes:
      - name: tmp
        emptyDir: {}
      - name: config
        configMap:
          name: connector-config

      # Node affinity (optional)
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchLabels:
                  app: port-scanner-connector
              topologyKey: kubernetes.io/hostname
```

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: connector-config
  namespace: strike48
data:
  config.toml: |
    [connector]
    max_concurrent_scans = 10
    timeout_seconds = 300

    [logging]
    level = "info"
    format = "json"
```

### Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: matrix-credentials
  namespace: strike48
type: Opaque
stringData:
  auth-token: "your-secure-token-here"
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace strike48

# Apply manifests
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml

# Check status
kubectl get pods -n strike48
kubectl logs -n strike48 -l app=port-scanner-connector -f

# Scale
kubectl scale deployment port-scanner-connector -n strike48 --replicas=5
```

### HorizontalPodAutoscaler

Scale based on CPU/memory:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: port-scanner-connector-hpa
  namespace: strike48
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: port-scanner-connector
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Monitoring and Observability

### Health Checks

Implement health endpoint:

```rust
use axum::{Router, routing::get};

pub fn health_routes() -> Router {
    Router::new()
        .route("/health", get(health_check))
        .route("/ready", get(readiness_check))
}

async fn health_check() -> &'static str {
    "OK"
}

async fn readiness_check() -> Result<&'static str, StatusCode> {
    // Check Prospector Studio connection
    if is_connected_to_studio().await {
        Ok("Ready")
    } else {
        Err(StatusCode::SERVICE_UNAVAILABLE)
    }
}
```

### Metrics with Prometheus

```rust
use prometheus::{Encoder, TextEncoder, Counter, Histogram, Registry};

lazy_static! {
    static ref REGISTRY: Registry = Registry::new();
    static ref SCANS_TOTAL: Counter =
        Counter::new("connector_scans_total", "Total scans performed")
            .expect("metric can be created");
    static ref SCAN_DURATION: Histogram =
        Histogram::new("connector_scan_duration_seconds", "Scan duration")
            .expect("metric can be created");
}

pub fn init_metrics() {
    REGISTRY.register(Box::new(SCANS_TOTAL.clone())).unwrap();
    REGISTRY.register(Box::new(SCAN_DURATION.clone())).unwrap();
}

pub async fn metrics_handler() -> Result<String, StatusCode> {
    let encoder = TextEncoder::new();
    let metric_families = REGISTRY.gather();
    let mut buffer = Vec::new();

    encoder.encode(&metric_families, &mut buffer)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    String::from_utf8(buffer)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

// Record metrics
pub async fn scan_target(target: &str) -> Result<ScanResult> {
    let timer = SCAN_DURATION.start_timer();

    let result = perform_scan(target).await;

    timer.observe_duration();
    SCANS_TOTAL.inc();

    result
}
```

### Structured Logging

```rust
use tracing::{info, error, instrument};
use tracing_subscriber::{fmt, EnvFilter};

pub fn init_logging() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .json() // JSON format for production
        .with_target(true)
        .with_current_span(true)
        .init();
}

#[instrument(skip(self))]
pub async fn scan_target(&self, target: &str) -> Result<ScanResult> {
    info!(target = %target, "Starting scan");

    match perform_scan(target).await {
        Ok(result) => {
            info!(
                target = %target,
                ports = result.open_ports.len(),
                duration_ms = result.duration_ms,
                "Scan completed"
            );
            Ok(result)
        }
        Err(e) => {
            error!(target = %target, error = %e, "Scan failed");
            Err(e)
        }
    }
}
```

## Graceful Shutdown

Handle SIGTERM for graceful shutdown:

```rust
use tokio::signal;

#[tokio::main]
async fn main() -> Result<()> {
    let config = load_config()?;
    let connector = Arc::new(MyConnector::new()?);

    // Spawn connector task
    let connector_clone = connector.clone();
    let connector_handle = tokio::spawn(async move {
        run_connector(connector_clone).await
    });

    // Wait for shutdown signal
    tokio::select! {
        result = connector_handle => {
            result??;
        }
        _ = shutdown_signal() => {
            info!("Received shutdown signal");
            connector.shutdown().await?;
        }
    }

    info!("Connector stopped gracefully");
    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install SIGTERM handler")
            .recv()
            .await;
    };

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}
```

## Best Practices

### ✅ Do

- **Use static linking** - For portable binaries
- **Implement health checks** - For orchestration platforms
- **Use secrets managers** - Never hardcode credentials
- **Enable structured logging** - JSON format for production
- **Add metrics** - Monitor performance and errors
- **Handle graceful shutdown** - Clean up resources
- **Set resource limits** - Prevent resource exhaustion
- **Use configuration files** - Keep config out of code
- **Version your images** - Never use `latest` in production
- **Test deployment** - Use staging environment first

### ❌ Don't

- **Don't run as root** - Use dedicated user account
- **Don't ignore signals** - Handle SIGTERM properly
- **Don't log secrets** - Sanitize sensitive data
- **Don't use debug builds** - Always use --release
- **Don't skip health checks** - Required for k8s/docker
- **Don't hardcode IPs/URLs** - Use configuration
- **Don't ignore resource limits** - Prevent OOM kills
- **Don't deploy untested builds** - Test in staging first

## Rollout Strategies

### Blue-Green Deployment

```bash
# Deploy new version (green)
kubectl apply -f deployment-v2.yaml

# Test new version
curl http://green-service/health

# Switch traffic
kubectl patch service my-connector -p '{"spec":{"selector":{"version":"v2"}}}'

# Rollback if needed
kubectl patch service my-connector -p '{"spec":{"selector":{"version":"v1"}}}'
```

### Canary Deployment

```yaml
# Canary with 10% traffic
apiVersion: v1
kind: Service
metadata:
  name: my-connector-canary
spec:
  selector:
    app: my-connector
    version: v2
  # ... service spec

# Main service (90% traffic)
apiVersion: v1
kind: Service
metadata:
  name: my-connector
spec:
  selector:
    app: my-connector
    version: v1
  # ... service spec
```

## Next Steps

- [Configuration](/developers/sdk-rs/configuration/) - Detailed configuration options
- [Testing](/developers/sdk-rs/guides/testing-connectors/) - Test deployment scripts
- [Error Handling](/developers/sdk-rs/guides/error-handling/) - Handle deployment errors

## Resources

- [Rust Deployment Guide](https://doc.rust-lang.org/cargo/guide/project-layout.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [systemd Documentation](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
