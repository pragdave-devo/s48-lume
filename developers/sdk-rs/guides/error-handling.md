---
title: Error Handling Patterns
description: Best practices for robust error handling in Strike48 connectors using thiserror, anyhow, and Result types.
nav_order: 8
parent: "For Developers"
---

Robust error handling is critical for production connectors. This guide covers error handling patterns, propagation strategies, and best practices for Strike48 connector development.

## Philosophy

Good error handling should:

1. **Be explicit** - Errors are values, not exceptions
2. **Provide context** - Include what went wrong and why
3. **Enable recovery** - Distinguish recoverable from fatal errors
4. **Aid debugging** - Include actionable information
5. **Be type-safe** - Use Rust's type system for correctness

## Error Crate Ecosystem

| Crate | Purpose | When to Use |
|-------|---------|-------------|
| **thiserror** | Define custom error types | Library code, structured errors |
| **anyhow** | Error propagation with context | Application code, rapid prototyping |
| **std::error::Error** | Error trait | When not using external crates |

**Recommendation**: Use **thiserror** for your connector's error types, **anyhow** for application-level error handling.

## Defining Error Types with thiserror

### Basic Error Enum

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ConnectorError {
    #[error("Invalid target: {0}")]
    InvalidTarget(String),

    #[error("Connection timeout after {timeout}s")]
    Timeout { timeout: u64 },

    #[error("Tool '{tool}' not found in PATH")]
    ToolNotFound { tool: String },

    #[error("Command execution failed: {0}")]
    ExecutionFailed(String),

    #[error("Failed to parse output: {0}")]
    ParseError(String),
}

pub type Result<T> = std::result::Result<T, ConnectorError>;
```

### Error Wrapping

Wrap standard library errors:

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ConnectorError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("JSON parsing error: {0}")]
    Json(#[from] serde_json::Error),

    #[error("HTTP request failed: {0}")]
    Http(#[from] reqwest::Error),

    #[error("Invalid UTF-8: {0}")]
    Utf8(#[from] std::string::FromUtf8Error),
}
```

The `#[from]` attribute automatically implements `From<OriginalError>` for conversion.

### Structured Error Information

Include structured data in errors:

```rust
#[derive(Error, Debug)]
pub enum ScanError {
    #[error("Port {port} on {target} is filtered")]
    PortFiltered {
        target: String,
        port: u16,
    },

    #[error("Scan of {target} failed after {attempts} attempts")]
    ScanFailed {
        target: String,
        attempts: u32,
        last_error: String,
    },

    #[error("Rate limit exceeded: {requests} requests in {window}s")]
    RateLimitExceeded {
        requests: u32,
        window: u64,
        retry_after: Option<u64>,
    },
}
```

## Error Propagation

### The ? Operator

Use `?` for automatic error propagation:

```rust
use std::fs;

pub fn read_config(path: &str) -> Result<Config> {
    // ? automatically converts errors via From trait
    let content = fs::read_to_string(path)?;
    let config: Config = serde_json::from_str(&content)?;
    Ok(config)
}
```

### Manual Error Conversion

When automatic conversion isn't available:

```rust
pub fn validate_port(port_str: &str) -> Result<u16> {
    port_str.parse::<u16>()
        .map_err(|_| ConnectorError::InvalidPort {
            value: port_str.to_string(),
            reason: "Must be between 1 and 65535".to_string(),
        })
}
```

### Adding Context with map_err

Add context while propagating:

```rust
use std::fs;

pub fn load_targets(path: &str) -> Result<Vec<String>> {
    fs::read_to_string(path)
        .map_err(|e| ConnectorError::ConfigError {
            file: path.to_string(),
            reason: format!("Failed to read file: {}", e),
        })?
        .lines()
        .map(|line| line.trim().to_string())
        .filter(|line| !line.is_empty())
        .collect::<Vec<_>>()
        .pipe(Ok)
}
```

## Error Hierarchies

### Layered Error Types

Organize errors by domain:

```rust
// Network layer errors
#[derive(Error, Debug)]
pub enum NetworkError {
    #[error("Connection refused to {host}:{port}")]
    ConnectionRefused { host: String, port: u16 },

    #[error("DNS lookup failed for {hostname}: {source}")]
    DnsError { hostname: String, source: String },

    #[error("TLS handshake failed: {0}")]
    TlsError(String),
}

// Scanner layer errors
#[derive(Error, Debug)]
pub enum ScannerError {
    #[error("Invalid scan configuration: {0}")]
    InvalidConfig(String),

    #[error("Scan timeout after {0}s")]
    Timeout(u64),

    #[error("Network error: {0}")]
    Network(#[from] NetworkError),
}

// Top-level connector errors
#[derive(Error, Debug)]
pub enum ConnectorError {
    #[error("Scanner error: {0}")]
    Scanner(#[from] ScannerError),

    #[error("Authentication failed: {0}")]
    Auth(String),

    #[error("Prospector Studio communication error: {0}")]
    Studio(#[from] strike48_connector_sdk::Error),
}
```

### Flattening Error Chains

Sometimes you want to flatten nested errors:

```rust
impl From<NetworkError> for ConnectorError {
    fn from(err: NetworkError) -> Self {
        match err {
            NetworkError::ConnectionRefused { host, port } => {
                ConnectorError::ConnectionFailed(format!("{}:{}", host, port))
            }
            NetworkError::DnsError { hostname, .. } => {
                ConnectorError::InvalidTarget(hostname)
            }
            NetworkError::TlsError(msg) => {
                ConnectorError::SecurityError(msg)
            }
        }
    }
}
```

## Using anyhow for Application Code

### Quick Error Handling

For application-level code (main.rs, bin files):

```rust
use anyhow::{Context, Result};

#[tokio::main]
async fn main() -> Result<()> {
    let config = load_config()
        .context("Failed to load configuration")?;

    let connector = create_connector(&config)
        .context("Failed to initialize connector")?;

    connector.run()
        .await
        .context("Connector execution failed")?;

    Ok(())
}

fn load_config() -> Result<Config> {
    let path = std::env::var("CONFIG_PATH")
        .context("CONFIG_PATH not set")?;

    let content = std::fs::read_to_string(&path)
        .with_context(|| format!("Failed to read config from {}", path))?;

    let config: Config = toml::from_str(&content)
        .context("Invalid TOML configuration")?;

    Ok(config)
}
```

### Error Context Stack

anyhow builds a context stack:

```rust
use anyhow::{Context, Result};

pub async fn scan_network(subnet: &str) -> Result<Vec<Host>> {
    let targets = expand_subnet(subnet)
        .context("Failed to expand subnet")?;

    let mut results = Vec::new();

    for target in targets {
        let host = scan_host(&target)
            .await
            .with_context(|| format!("Failed to scan {}", target))?;

        results.push(host);
    }

    Ok(results)
}
```

Error output:
```
Error: Failed to scan 192.168.1.100
Caused by:
    0: Connection timeout
    1: Failed to connect to 192.168.1.100:22
    2: Connection refused
```

## Recoverable vs Fatal Errors

### Distinguishing Error Types

```rust
#[derive(Error, Debug)]
pub enum ScanError {
    // Recoverable - can retry or skip
    #[error("Target {0} is unreachable")]
    Unreachable(String),

    #[error("Port {0} is filtered")]
    Filtered(u16),

    // Fatal - should stop execution
    #[error("Invalid scan configuration: {0}")]
    InvalidConfig(String),

    #[error("Scanner tool not found: {0}")]
    ToolMissing(String),
}

impl ScanError {
    pub fn is_recoverable(&self) -> bool {
        matches!(self, Self::Unreachable(_) | Self::Filtered(_))
    }

    pub fn is_fatal(&self) -> bool {
        !self.is_recoverable()
    }
}
```

### Handling Recoverable Errors

```rust
pub async fn scan_targets(targets: Vec<String>) -> Result<ScanResults> {
    let mut successful = Vec::new();
    let mut failed = Vec::new();

    for target in targets {
        match scan_target(&target).await {
            Ok(result) => successful.push(result),
            Err(e) if e.is_recoverable() => {
                tracing::warn!("Scan failed for {}: {}", target, e);
                failed.push((target, e.to_string()));
            }
            Err(e) => {
                // Fatal error - propagate immediately
                return Err(e);
            }
        }
    }

    Ok(ScanResults { successful, failed })
}
```

## Error Logging

### Structured Logging with tracing

```rust
use tracing::{error, warn, info, debug};

pub async fn execute_scan(target: &str) -> Result<ScanResult> {
    info!(target = %target, "Starting scan");

    match perform_scan(target).await {
        Ok(result) => {
            info!(
                target = %target,
                open_ports = result.open_ports.len(),
                duration_ms = result.duration_ms,
                "Scan completed successfully"
            );
            Ok(result)
        }
        Err(e) if e.is_recoverable() => {
            warn!(
                target = %target,
                error = %e,
                "Scan failed but recoverable"
            );
            Err(e)
        }
        Err(e) => {
            error!(
                target = %target,
                error = %e,
                error_debug = ?e,
                "Scan failed fatally"
            );
            Err(e)
        }
    }
}
```

### Logging Error Chains

Log the full error chain for debugging:

```rust
use tracing::error;

pub fn log_error_chain(err: &dyn std::error::Error) {
    error!("Error: {}", err);

    let mut source = err.source();
    let mut level = 1;

    while let Some(err) = source {
        error!("  Caused by ({}): {}", level, err);
        source = err.source();
        level += 1;
    }
}

// Usage
if let Err(e) = run_connector().await {
    log_error_chain(&e);
}
```

## Converting to SDK Errors

### Mapping to Strike48 Error Codes

```rust
use strike48_connector_sdk::{ConnectorError, ErrorCode};

pub fn to_sdk_error(err: ScanError) -> ConnectorError {
    match err {
        ScanError::InvalidTarget(msg) => {
            ConnectorError::new(ErrorCode::InvalidInput, &msg)
        }
        ScanError::Timeout(duration) => {
            ConnectorError::new(
                ErrorCode::Timeout,
                &format!("Scan timed out after {}s", duration)
            )
        }
        ScanError::ToolMissing(tool) => {
            ConnectorError::new(
                ErrorCode::SystemError,
                &format!("Required tool not found: {}", tool)
            )
        }
        ScanError::Network(e) => {
            ConnectorError::new(ErrorCode::NetworkError, &e.to_string())
        }
        _ => {
            ConnectorError::new(ErrorCode::ExecutionError, &err.to_string())
        }
    }
}
```

### Implementing BaseConnector with Error Conversion

```rust
use strike48_connector_sdk::*;

impl BaseConnector for ScannerConnector {
    fn execute(
        &self,
        request: serde_json::Value,
        capability_id: Option<&str>,
    ) -> Pin<Box<dyn Future<Output = Result<serde_json::Value>> + Send>> {
        Box::pin(async move {
            // Internal Result type
            let result: crate::Result<ScanResult> = match capability_id {
                Some("quick-scan") => self.quick_scan(request).await,
                Some("full-scan") => self.full_scan(request).await,
                _ => Err(ScanError::UnknownCapability),
            };

            // Convert to SDK Result
            result
                .map(|r| serde_json::to_value(r).unwrap())
                .map_err(|e| to_sdk_error(e))
        })
    }
}
```

## Error Response Format

### Structured Error Responses

Return structured error information to clients:

```rust
use serde::Serialize;

#[derive(Serialize)]
pub struct ErrorResponse {
    pub error: String,
    pub error_code: String,
    pub details: Option<serde_json::Value>,
    pub timestamp: String,
}

impl From<ScanError> for ErrorResponse {
    fn from(err: ScanError) -> Self {
        let (error_code, details) = match &err {
            ScanError::Timeout { duration } => (
                "SCAN_TIMEOUT",
                Some(serde_json::json!({ "duration_seconds": duration }))
            ),
            ScanError::InvalidTarget { target, reason } => (
                "INVALID_TARGET",
                Some(serde_json::json!({
                    "target": target,
                    "reason": reason
                }))
            ),
            _ => ("SCAN_ERROR", None),
        };

        ErrorResponse {
            error: err.to_string(),
            error_code: error_code.to_string(),
            details,
            timestamp: chrono::Utc::now().to_rfc3339(),
        }
    }
}
```

## Retry Logic

### Exponential Backoff

```rust
use tokio::time::{sleep, Duration};

pub async fn scan_with_retry(
    target: &str,
    max_attempts: u32,
) -> Result<ScanResult> {
    let mut attempts = 0;
    let mut delay = Duration::from_secs(1);

    loop {
        attempts += 1;

        match scan_target(target).await {
            Ok(result) => return Ok(result),
            Err(e) if e.is_recoverable() && attempts < max_attempts => {
                warn!(
                    target = %target,
                    attempt = attempts,
                    delay_ms = delay.as_millis(),
                    error = %e,
                    "Scan failed, retrying"
                );

                sleep(delay).await;
                delay *= 2; // Exponential backoff
            }
            Err(e) => {
                error!(
                    target = %target,
                    attempts = attempts,
                    error = %e,
                    "Scan failed after max attempts"
                );
                return Err(e);
            }
        }
    }
}
```

### Retry with Circuit Breaker

```rust
use std::sync::Arc;
use tokio::sync::RwLock;

pub struct CircuitBreaker {
    failure_count: Arc<RwLock<u32>>,
    threshold: u32,
    timeout: Duration,
}

impl CircuitBreaker {
    pub fn new(threshold: u32, timeout: Duration) -> Self {
        Self {
            failure_count: Arc::new(RwLock::new(0)),
            threshold,
            timeout,
        }
    }

    pub async fn call<F, T>(&self, f: F) -> Result<T>
    where
        F: Future<Output = Result<T>>,
    {
        let count = *self.failure_count.read().await;

        if count >= self.threshold {
            return Err(ScanError::CircuitOpen {
                failures: count,
                retry_after: self.timeout,
            });
        }

        match f.await {
            Ok(result) => {
                *self.failure_count.write().await = 0;
                Ok(result)
            }
            Err(e) => {
                *self.failure_count.write().await += 1;
                Err(e)
            }
        }
    }
}
```

## Validation Errors

### Input Validation

```rust
#[derive(Error, Debug)]
pub enum ValidationError {
    #[error("Field '{field}' is required")]
    Required { field: String },

    #[error("Field '{field}' has invalid format: {reason}")]
    InvalidFormat { field: String, reason: String },

    #[error("Field '{field}' value {value} is out of range [{min}, {max}]")]
    OutOfRange {
        field: String,
        value: String,
        min: String,
        max: String,
    },
}

pub fn validate_scan_request(req: &ScanRequest) -> Result<(), ValidationError> {
    if req.target.is_empty() {
        return Err(ValidationError::Required {
            field: "target".to_string(),
        });
    }

    if req.timeout == 0 || req.timeout > 3600 {
        return Err(ValidationError::OutOfRange {
            field: "timeout".to_string(),
            value: req.timeout.to_string(),
            min: "1".to_string(),
            max: "3600".to_string(),
        });
    }

    // Validate IP/hostname format
    if !is_valid_target(&req.target) {
        return Err(ValidationError::InvalidFormat {
            field: "target".to_string(),
            reason: "Must be valid IP address or hostname".to_string(),
        });
    }

    Ok(())
}
```

### Builder Pattern with Validation

```rust
pub struct ScanConfigBuilder {
    target: Option<String>,
    ports: Vec<u16>,
    timeout: u64,
}

impl ScanConfigBuilder {
    pub fn new() -> Self {
        Self {
            target: None,
            ports: vec![],
            timeout: 300,
        }
    }

    pub fn target(mut self, target: impl Into<String>) -> Self {
        self.target = Some(target.into());
        self
    }

    pub fn ports(mut self, ports: Vec<u16>) -> Self {
        self.ports = ports;
        self
    }

    pub fn timeout(mut self, timeout: u64) -> Self {
        self.timeout = timeout;
        self
    }

    pub fn build(self) -> Result<ScanConfig> {
        let target = self.target.ok_or_else(|| {
            ValidationError::Required { field: "target".to_string() }
        })?;

        if self.ports.is_empty() {
            return Err(ValidationError::Required {
                field: "ports".to_string(),
            }.into());
        }

        Ok(ScanConfig {
            target,
            ports: self.ports,
            timeout: self.timeout,
        })
    }
}
```

## Best Practices

### ✅ Do

- **Use thiserror for library code** - Clear, structured error types
- **Use anyhow for application code** - Quick context addition
- **Make errors actionable** - Include what to do to fix it
- **Log at appropriate levels** - error!, warn!, info!, debug!
- **Distinguish recoverable errors** - Don't fail fast unnecessarily
- **Include structured data** - Make errors machine-readable
- **Test error paths** - Write tests for error scenarios
- **Document error conditions** - Use `/// # Errors` in doc comments

### ❌ Don't

- **Don't panic in library code** - Return Result instead
- **Don't swallow errors** - Always propagate or log
- **Don't use unwrap/expect** - Unless you're 100% certain
- **Don't create generic errors** - Be specific about what failed
- **Don't log and return** - Do one or the other, not both
- **Don't include secrets in errors** - Sanitize sensitive data

## Example: Complete Error Module

```rust
// src/error.rs
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ConnectorError {
    // Input validation
    #[error("Invalid target: {0}")]
    InvalidTarget(String),

    #[error("Invalid port range: {0}")]
    InvalidPortRange(String),

    // External tool errors
    #[error("Tool '{tool}' not found - ensure {tool} is installed")]
    ToolNotFound { tool: String },

    #[error("Tool execution failed: {0}")]
    ToolExecutionFailed(String),

    // Network errors
    #[error("Connection timeout after {timeout}s")]
    Timeout { timeout: u64 },

    #[error("Connection refused to {host}:{port}")]
    ConnectionRefused { host: String, port: u16 },

    // Parsing errors
    #[error("Failed to parse output: {0}")]
    ParseError(String),

    // Wrapped errors
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),
}

impl ConnectorError {
    pub fn is_recoverable(&self) -> bool {
        matches!(
            self,
            Self::Timeout { .. }
                | Self::ConnectionRefused { .. }
        )
    }
}

pub type Result<T> = std::result::Result<T, ConnectorError>;
```

## Next Steps

- [Async Patterns with Tokio](/developers/sdk-rs/guides/async-patterns/) - Asynchronous programming best practices
- [Testing Connectors](/developers/sdk-rs/guides/testing-connectors/) - Test error scenarios
- [Building Your First Connector](/developers/sdk-rs/guides/building-your-first-connector/) - Apply error handling patterns

## Resources

- [thiserror Documentation](https://docs.rs/thiserror/)
- [anyhow Documentation](https://docs.rs/anyhow/)
- [Rust Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html)
- [tracing Documentation](https://docs.rs/tracing/)
