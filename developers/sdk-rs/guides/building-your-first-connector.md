---
title: Building Your First Connector
description: A comprehensive tutorial for building a practical port scanner connector with the Strike48 SDK.
nav_order: 6
parent: "For Developers"
---

This tutorial walks you through building a real-world port scanner connector from scratch. You'll learn how to structure a connector project, implement multiple capabilities, handle errors gracefully, and test your connector.

## What You'll Build

A **Port Scanner Connector** that provides three capabilities:
1. **Quick Scan** - Fast SYN scan of common ports
2. **Full Scan** - Comprehensive scan of all 65,535 ports
3. **Service Detection** - Scan with version detection and OS fingerprinting

By the end of this tutorial, you'll understand:
- Project structure for real connectors
- Capability-based design patterns
- Error handling and validation
- Structured output formats
- Testing strategies
- Configuration management

## Prerequisites

Before starting, ensure you have:
- [Rust toolchain installed](/developers/sdk-rs/installation/)
- Basic knowledge of async Rust (Tokio)
- `nmap` installed on your system (we'll wrap it)

Verify nmap is available:
```bash
nmap --version
# Should show: Nmap version 7.x or higher
```

## Project Setup

### 1. Create the Project

```bash
cargo new --bin port-scanner-connector
cd port-scanner-connector
```

### 2. Configure Dependencies

Edit `Cargo.toml`:

```toml
[package]
name = "port-scanner-connector"
version = "0.1.0"
edition = "2021"

[dependencies]
# Strike48 SDK
strike48-connector-sdk = { git = "https://github.com/Strike48/sdk-rs" }

# Async runtime
tokio = { version = "1", features = ["full"] }

# Serialization
serde = { version = "1", features = ["derive"] }
serde_json = "1"

# Date/time
chrono = "0.4"

# Logging
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }

# Error handling
thiserror = "1"
anyhow = "1"

[dev-dependencies]
tokio-test = "0.4"
```

### 3. Project Structure

Create this directory structure:

```
port-scanner-connector/
├── src/
│   ├── main.rs           # Entry point and runner
│   ├── connector.rs      # Connector implementation
│   ├── capabilities.rs   # Capability handlers
│   ├── scanner.rs        # Scanner logic (nmap wrapper)
│   ├── types.rs          # Data types and models
│   └── error.rs          # Error types
├── tests/
│   └── integration.rs    # Integration tests
├── Cargo.toml
└── README.md
```

Create the module files:
```bash
touch src/connector.rs src/capabilities.rs src/scanner.rs src/types.rs src/error.rs
mkdir tests
touch tests/integration.rs
```

## Step 1: Define Error Types

Start with `src/error.rs` to define custom error types:

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ScannerError {
    #[error("Invalid target: {0}")]
    InvalidTarget(String),

    #[error("Invalid port range: {0}")]
    InvalidPortRange(String),

    #[error("nmap not found - ensure nmap is installed")]
    NmapNotFound,

    #[error("nmap execution failed: {0}")]
    NmapExecutionFailed(String),

    #[error("Failed to parse nmap output: {0}")]
    ParseError(String),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),

    #[error("JSON error: {0}")]
    JsonError(#[from] serde_json::Error),
}

pub type Result<T> = std::result::Result<T, ScannerError>;
```

## Step 2: Define Data Types

Create `src/types.rs` for structured data models:

```rust
use serde::{Deserialize, Serialize};

/// Scan request from client
#[derive(Debug, Deserialize)]
pub struct ScanRequest {
    /// Target IP or hostname
    pub target: String,

    /// Optional: Specific ports to scan (e.g., "80,443,8080")
    #[serde(default)]
    pub ports: Option<String>,

    /// Optional: Scan timeout in seconds
    #[serde(default = "default_timeout")]
    pub timeout: u32,
}

fn default_timeout() -> u32 {
    300 // 5 minutes
}

/// Scan result returned to client
#[derive(Debug, Serialize)]
pub struct ScanResult {
    /// Target that was scanned
    pub target: String,

    /// Scan start time (ISO 8601)
    pub start_time: String,

    /// Scan end time (ISO 8601)
    pub end_time: String,

    /// Duration in seconds
    pub duration_seconds: f64,

    /// Discovered open ports
    pub open_ports: Vec<PortInfo>,

    /// Total ports scanned
    pub ports_scanned: u32,

    /// Scan status
    pub status: ScanStatus,
}

#[derive(Debug, Serialize)]
pub struct PortInfo {
    /// Port number
    pub port: u16,

    /// Protocol (tcp/udp)
    pub protocol: String,

    /// Service name (http, ssh, etc.)
    pub service: Option<String>,

    /// Service version
    pub version: Option<String>,

    /// Port state (open, filtered, closed)
    pub state: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum ScanStatus {
    Completed,
    PartiallyCompleted,
    Failed,
}

/// Capability metadata
#[derive(Debug, Serialize)]
pub struct CapabilityInfo {
    pub id: String,
    pub name: String,
    pub description: String,
    pub estimated_duration: String,
}
```

## Step 3: Implement the Scanner

Create `src/scanner.rs` to wrap nmap:

```rust
use crate::error::{Result, ScannerError};
use crate::types::{PortInfo, ScanResult, ScanStatus};
use chrono::Utc;
use std::process::Command;
use std::time::Instant;
use tracing::{debug, info, warn};

pub struct NmapScanner;

impl NmapScanner {
    /// Check if nmap is available
    pub fn check_available() -> Result<()> {
        let output = Command::new("nmap")
            .arg("--version")
            .output()
            .map_err(|_| ScannerError::NmapNotFound)?;

        if !output.status.success() {
            return Err(ScannerError::NmapNotFound);
        }

        Ok(())
    }

    /// Run a quick scan (common ports only)
    pub async fn quick_scan(target: &str, timeout: u32) -> Result<ScanResult> {
        info!("Starting quick scan of {}", target);

        Self::validate_target(target)?;
        let start_time = Utc::now();
        let timer = Instant::now();

        let args = vec![
            "-T4",              // Aggressive timing
            "-F",               // Fast mode (100 most common ports)
            "--open",           // Show only open ports
            "-oX", "-",         // XML output to stdout
            target,
        ];

        let ports = Self::execute_nmap(&args, timeout).await?;

        let duration = timer.elapsed().as_secs_f64();
        let end_time = Utc::now();

        Ok(ScanResult {
            target: target.to_string(),
            start_time: start_time.to_rfc3339(),
            end_time: end_time.to_rfc3339(),
            duration_seconds: duration,
            open_ports: ports.clone(),
            ports_scanned: 100,
            status: if ports.is_empty() {
                ScanStatus::PartiallyCompleted
            } else {
                ScanStatus::Completed
            },
        })
    }

    /// Run a full port scan
    pub async fn full_scan(target: &str, timeout: u32) -> Result<ScanResult> {
        info!("Starting full scan of {}", target);

        Self::validate_target(target)?;
        let start_time = Utc::now();
        let timer = Instant::now();

        let args = vec![
            "-p-",              // All 65535 ports
            "-T4",              // Aggressive timing
            "--open",           // Show only open ports
            "-oX", "-",         // XML output to stdout
            target,
        ];

        let ports = Self::execute_nmap(&args, timeout).await?;

        let duration = timer.elapsed().as_secs_f64();
        let end_time = Utc::now();

        Ok(ScanResult {
            target: target.to_string(),
            start_time: start_time.to_rfc3339(),
            end_time: end_time.to_rfc3339(),
            duration_seconds: duration,
            open_ports: ports.clone(),
            ports_scanned: 65535,
            status: if ports.is_empty() {
                ScanStatus::PartiallyCompleted
            } else {
                ScanStatus::Completed
            },
        })
    }

    /// Run service detection scan
    pub async fn service_scan(target: &str, timeout: u32) -> Result<ScanResult> {
        info!("Starting service detection scan of {}", target);

        Self::validate_target(target)?;
        let start_time = Utc::now();
        let timer = Instant::now();

        let args = vec![
            "-sV",              // Version detection
            "-O",               // OS detection
            "-T4",              // Aggressive timing
            "--open",           // Show only open ports
            "-oX", "-",         // XML output to stdout
            target,
        ];

        let ports = Self::execute_nmap(&args, timeout).await?;

        let duration = timer.elapsed().as_secs_f64();
        let end_time = Utc::now();

        Ok(ScanResult {
            target: target.to_string(),
            start_time: start_time.to_rfc3339(),
            end_time: end_time.to_rfc3339(),
            duration_seconds: duration,
            open_ports: ports.clone(),
            ports_scanned: 1000, // nmap default port set
            status: if ports.is_empty() {
                ScanStatus::PartiallyCompleted
            } else {
                ScanStatus::Completed
            },
        })
    }

    /// Validate target format
    fn validate_target(target: &str) -> Result<()> {
        if target.is_empty() {
            return Err(ScannerError::InvalidTarget("Target cannot be empty".to_string()));
        }

        // Basic validation - could be enhanced with proper IP/hostname parsing
        if target.contains(';') || target.contains('&') || target.contains('|') {
            return Err(ScannerError::InvalidTarget(
                "Target contains invalid characters".to_string()
            ));
        }

        Ok(())
    }

    /// Execute nmap and parse results
    async fn execute_nmap(args: &[&str], timeout: u32) -> Result<Vec<PortInfo>> {
        debug!("Executing nmap with args: {:?}", args);

        // Run nmap in a blocking task (it's CPU-bound)
        let args_owned: Vec<String> = args.iter().map(|s| s.to_string()).collect();

        let output = tokio::task::spawn_blocking(move || {
            let mut cmd = Command::new("nmap");
            cmd.args(&args_owned);
            cmd.output()
        })
        .await
        .map_err(|e| ScannerError::NmapExecutionFailed(e.to_string()))?
        .map_err(|e| ScannerError::NmapExecutionFailed(e.to_string()))?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            warn!("nmap execution failed: {}", stderr);
            return Err(ScannerError::NmapExecutionFailed(stderr.to_string()));
        }

        // Parse XML output
        let stdout = String::from_utf8_lossy(&output.stdout);
        Self::parse_nmap_xml(&stdout)
    }

    /// Parse nmap XML output
    fn parse_nmap_xml(xml: &str) -> Result<Vec<PortInfo>> {
        let mut ports = Vec::new();

        // Simple XML parsing - in production, use proper XML parser (quick-xml)
        // This is a simplified example
        for line in xml.lines() {
            if line.contains("<port ") && line.contains("open") {
                // Extract port number
                if let Some(port_str) = Self::extract_attribute(line, "portid") {
                    if let Ok(port) = port_str.parse::<u16>() {
                        let protocol = Self::extract_attribute(line, "protocol")
                            .unwrap_or_else(|| "tcp".to_string());

                        ports.push(PortInfo {
                            port,
                            protocol,
                            service: None,
                            version: None,
                            state: "open".to_string(),
                        });
                    }
                }
            }
        }

        Ok(ports)
    }

    /// Extract XML attribute value
    fn extract_attribute(line: &str, attr: &str) -> Option<String> {
        let pattern = format!("{}=\"", attr);
        if let Some(start) = line.find(&pattern) {
            let start = start + pattern.len();
            if let Some(end) = line[start..].find('"') {
                return Some(line[start..start + end].to_string());
            }
        }
        None
    }
}
```

## Step 4: Implement Capabilities

Create `src/capabilities.rs` to handle each capability:

```rust
use crate::error::Result;
use crate::scanner::NmapScanner;
use crate::types::{ScanRequest, ScanResult};
use serde_json::Value;
use tracing::info;

pub struct Capabilities;

impl Capabilities {
    /// Handle quick-scan capability
    pub async fn handle_quick_scan(request: Value) -> Result<Value> {
        info!("Handling quick-scan capability");

        let req: ScanRequest = serde_json::from_value(request)?;
        let result = NmapScanner::quick_scan(&req.target, req.timeout).await?;

        Ok(serde_json::to_value(result)?)
    }

    /// Handle full-scan capability
    pub async fn handle_full_scan(request: Value) -> Result<Value> {
        info!("Handling full-scan capability");

        let req: ScanRequest = serde_json::from_value(request)?;
        let result = NmapScanner::full_scan(&req.target, req.timeout).await?;

        Ok(serde_json::to_value(result)?)
    }

    /// Handle service-scan capability
    pub async fn handle_service_scan(request: Value) -> Result<Value> {
        info!("Handling service-scan capability");

        let req: ScanRequest = serde_json::from_value(request)?;
        let result = NmapScanner::service_scan(&req.target, req.timeout).await?;

        Ok(serde_json::to_value(result)?)
    }

    /// List available capabilities
    pub async fn list_capabilities() -> Result<Value> {
        use crate::types::CapabilityInfo;

        let capabilities = vec![
            CapabilityInfo {
                id: "quick-scan".to_string(),
                name: "Quick Scan".to_string(),
                description: "Fast SYN scan of 100 most common ports".to_string(),
                estimated_duration: "10-30 seconds".to_string(),
            },
            CapabilityInfo {
                id: "full-scan".to_string(),
                name: "Full Port Scan".to_string(),
                description: "Comprehensive scan of all 65,535 ports".to_string(),
                estimated_duration: "5-30 minutes".to_string(),
            },
            CapabilityInfo {
                id: "service-scan".to_string(),
                name: "Service Detection".to_string(),
                description: "Scan with version detection and OS fingerprinting".to_string(),
                estimated_duration: "1-5 minutes".to_string(),
            },
        ];

        Ok(serde_json::to_value(capabilities)?)
    }
}
```

## Step 5: Implement the Connector

Create `src/connector.rs`:

```rust
use crate::capabilities::Capabilities;
use crate::scanner::NmapScanner;
use strike48_connector_sdk::*;
use tracing::{error, info, warn};

pub struct PortScannerConnector;

impl PortScannerConnector {
    pub fn new() -> Result<Self> {
        // Verify nmap is available
        NmapScanner::check_available()
            .map_err(|e| ConnectorError::new(ErrorCode::SystemError, &e.to_string()))?;

        info!("Port Scanner Connector initialized successfully");
        Ok(Self)
    }
}

impl BaseConnector for PortScannerConnector {
    fn connector_type(&self) -> &str {
        "port-scanner"
    }

    fn version(&self) -> &str {
        env!("CARGO_PKG_VERSION")
    }

    fn execute(
        &self,
        request: serde_json::Value,
        capability_id: Option<&str>,
    ) -> std::pin::Pin<
        Box<dyn std::future::Future<Output = Result<serde_json::Value>> + Send>
    > {
        Box::pin(async move {
            info!("Executing capability: {:?}", capability_id);

            let result = match capability_id {
                Some("quick-scan") => Capabilities::handle_quick_scan(request).await,
                Some("full-scan") => Capabilities::handle_full_scan(request).await,
                Some("service-scan") => Capabilities::handle_service_scan(request).await,
                Some("list") => Capabilities::list_capabilities().await,
                None => Capabilities::list_capabilities().await,
                Some(unknown) => {
                    warn!("Unknown capability requested: {}", unknown);
                    return Err(ConnectorError::new(
                        ErrorCode::InvalidInput,
                        &format!("Unknown capability: {}", unknown),
                    ));
                }
            };

            result.map_err(|e| {
                error!("Capability execution failed: {}", e);
                ConnectorError::new(ErrorCode::ExecutionError, &e.to_string())
            })
        })
    }
}
```

## Step 6: Main Entry Point

Update `src/main.rs`:

```rust
mod capabilities;
mod connector;
mod error;
mod scanner;
mod types;

use connector::PortScannerConnector;
use strike48_connector_sdk::*;
use std::sync::Arc;
use tracing::info;

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::from_default_env()
                .add_directive(tracing::Level::INFO.into()),
        )
        .init();

    info!("Starting Port Scanner Connector...");

    // Load configuration from environment
    let config = ConnectorConfig::from_env();

    // Create connector
    let connector = Arc::new(PortScannerConnector::new()?);

    // Run connector
    let runner = ConnectorRunner::new(config, connector);
    runner.run().await?;

    Ok(())
}
```

## Step 7: Add Tests

Create `tests/integration.rs`:

```rust
use port_scanner_connector::*;

#[tokio::test]
async fn test_quick_scan_localhost() {
    let scanner = NmapScanner;
    let result = scanner.quick_scan("127.0.0.1", 300).await;

    assert!(result.is_ok());
    let scan_result = result.unwrap();
    assert_eq!(scan_result.target, "127.0.0.1");
    assert!(scan_result.duration_seconds > 0.0);
}

#[tokio::test]
async fn test_invalid_target() {
    let scanner = NmapScanner;
    let result = scanner.quick_scan("invalid; target", 300).await;

    assert!(result.is_err());
}

#[test]
fn test_nmap_available() {
    let result = NmapScanner::check_available();
    assert!(result.is_ok(), "nmap should be installed for tests");
}
```

## Step 8: Build and Run

```bash
# Build the connector
cargo build --release

# Set environment variables
export MATRIX_HOST=localhost:50061
export TENANT_ID=default
export CONNECTOR_TYPE=port-scanner
export INSTANCE_ID=scanner-prod-1
export RUST_LOG=info

# Run the connector
cargo run --release
```

## Step 9: Test Your Connector

### Via Prospector Studio

Send a quick scan request:

```json
{
  "target": "scanme.nmap.org",
  "timeout": 300
}
```

Select the `quick-scan` capability.

### Expected Response

```json
{
  "target": "scanme.nmap.org",
  "start_time": "2026-03-04T12:00:00Z",
  "end_time": "2026-03-04T12:00:15Z",
  "duration_seconds": 15.3,
  "open_ports": [
    {
      "port": 22,
      "protocol": "tcp",
      "service": "ssh",
      "version": null,
      "state": "open"
    },
    {
      "port": 80,
      "protocol": "tcp",
      "service": "http",
      "version": null,
      "state": "open"
    }
  ],
  "ports_scanned": 100,
  "status": "completed"
}
```

## What You've Learned

✅ **Project structure** - Organizing a real connector with multiple modules
✅ **Error handling** - Custom error types with `thiserror`
✅ **Data modeling** - Structured requests and responses with `serde`
✅ **Capability pattern** - Routing different operations through one connector
✅ **External tool integration** - Wrapping nmap safely
✅ **Async execution** - Using Tokio for non-blocking operations
✅ **Testing** - Writing integration tests
✅ **Configuration** - Using environment variables

## Next Steps

### Enhance the Scanner

1. **Add custom port ranges**
   ```rust
   pub struct ScanRequest {
       pub target: String,
       pub ports: Option<String>, // "80,443,8000-9000"
   }
   ```

2. **Add UDP scanning**
   ```rust
   pub async fn udp_scan(target: &str) -> Result<ScanResult> {
       // Use nmap -sU for UDP ports
   }
   ```

3. **Add scheduled scans**
   ```rust
   pub async fn schedule_scan(
       target: String,
       interval: Duration,
   ) -> Result<()> {
       // Periodic scanning with tokio::time::interval
   }
   ```

### Production Improvements

1. **Proper XML parsing** - Use `quick-xml` crate instead of string matching
2. **Rate limiting** - Limit concurrent scans
3. **Result caching** - Cache recent scan results
4. **Metrics** - Add Prometheus metrics for scan duration, success rates
5. **Security** - Add IP allowlisting, scan quotas

### Advanced Patterns

- [Testing Connectors](/developers/sdk-rs/guides/testing/) - Comprehensive testing strategies
- [Error Handling](/developers/sdk-rs/guides/error-handling/) - Advanced error patterns
- [Configuration](/developers/sdk-rs/configuration/) - Complex configuration management
- [Deploying Connectors](/developers/sdk-rs/guides/deployment/) - Production deployment

## Resources

- [SDK API Reference](https://github.com/Strike48/sdk-rs)
- [Example Connectors](https://github.com/Strike48/sdk-rs/tree/main/examples)
- [Nmap Documentation](https://nmap.org/book/man.html)

---

**Congratulations!** You've built a production-ready port scanner connector. You now understand the patterns needed to build any Strike48 connector.
