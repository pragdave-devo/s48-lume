---
title: Testing Connectors
description: Comprehensive testing strategies for Strike48 connectors with unit tests, integration tests, and mocking patterns.
nav_order: 7
parent: "For Developers"
---

Testing is critical for building reliable connectors. This guide covers testing strategies, patterns, and best practices for Strike48 connector development.

## Testing Strategy

A well-tested connector should have:

| Test Type | Coverage | Speed | Purpose |
|-----------|----------|-------|---------|
| **Unit Tests** | Individual functions | Fast | Verify logic correctness |
| **Integration Tests** | Full connector | Medium | Test Prospector Studio integration |
| **End-to-End Tests** | Real tools | Slow | Verify actual behavior |
| **Mock Tests** | External dependencies | Fast | Test error scenarios |

Aim for **80%+ code coverage** with a mix of all test types.

## Project Structure

```
my-connector/
├── src/
│   ├── lib.rs          # Expose modules for testing
│   ├── connector.rs
│   ├── capabilities.rs
│   └── scanner.rs
├── tests/
│   ├── unit/
│   │   ├── mod.rs
│   │   ├── test_scanner.rs
│   │   └── test_capabilities.rs
│   └── integration/
│       ├── mod.rs
│       └── test_connector.rs
└── Cargo.toml
```

## Setup

### 1. Configure Cargo.toml

```toml
[package]
name = "my-connector"
version = "0.1.0"
edition = "2021"

[lib]
name = "my_connector"
path = "src/lib.rs"

[[bin]]
name = "my-connector"
path = "src/main.rs"

[dependencies]
strike48-connector-sdk = { git = "https://github.com/Strike48/sdk-rs" }
tokio = { version = "1", features = ["full"] }
serde_json = "1"

[dev-dependencies]
tokio-test = "0.4"
mockall = "0.12"
wiremock = "0.6"
tempfile = "3"
```

### 2. Create lib.rs

Expose modules for testing in `src/lib.rs`:

```rust
pub mod capabilities;
pub mod connector;
pub mod error;
pub mod scanner;
pub mod types;

// Re-export commonly used types
pub use connector::MyConnector;
pub use error::{Error, Result};
pub use types::*;
```

Update `src/main.rs` to use the library:

```rust
use my_connector::MyConnector;
use strike48_connector_sdk::*;
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<()> {
    let config = ConnectorConfig::from_env();
    let connector = Arc::new(MyConnector::new()?);
    let runner = ConnectorRunner::new(config, connector);
    runner.run().await?;
    Ok(())
}
```

## Unit Testing

### Testing Pure Functions

```rust
// src/scanner.rs
pub struct Scanner;

impl Scanner {
    /// Parse port list "80,443,8000-9000" into Vec<u16>
    pub fn parse_ports(input: &str) -> Result<Vec<u16>> {
        let mut ports = Vec::new();

        for part in input.split(',') {
            let part = part.trim();

            if part.contains('-') {
                // Range: "8000-9000"
                let range: Vec<&str> = part.split('-').collect();
                if range.len() != 2 {
                    return Err(Error::InvalidPortRange(part.to_string()));
                }

                let start: u16 = range[0].parse()
                    .map_err(|_| Error::InvalidPortRange(part.to_string()))?;
                let end: u16 = range[1].parse()
                    .map_err(|_| Error::InvalidPortRange(part.to_string()))?;

                for port in start..=end {
                    ports.push(port);
                }
            } else {
                // Single port: "80"
                let port: u16 = part.parse()
                    .map_err(|_| Error::InvalidPortRange(part.to_string()))?;
                ports.push(port);
            }
        }

        Ok(ports)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_single_port() {
        let result = Scanner::parse_ports("80").unwrap();
        assert_eq!(result, vec![80]);
    }

    #[test]
    fn test_parse_multiple_ports() {
        let result = Scanner::parse_ports("80,443,8080").unwrap();
        assert_eq!(result, vec![80, 443, 8080]);
    }

    #[test]
    fn test_parse_port_range() {
        let result = Scanner::parse_ports("8000-8003").unwrap();
        assert_eq!(result, vec![8000, 8001, 8002, 8003]);
    }

    #[test]
    fn test_parse_mixed() {
        let result = Scanner::parse_ports("80, 443, 8000-8002").unwrap();
        assert_eq!(result, vec![80, 443, 8000, 8001, 8002]);
    }

    #[test]
    fn test_parse_invalid_format() {
        let result = Scanner::parse_ports("not-a-port");
        assert!(result.is_err());
    }

    #[test]
    fn test_parse_invalid_range() {
        let result = Scanner::parse_ports("8000-8001-8002");
        assert!(result.is_err());
    }
}
```

### Testing Async Functions

```rust
// src/capabilities.rs
pub struct Capabilities;

impl Capabilities {
    pub async fn validate_target(target: &str) -> Result<String> {
        if target.is_empty() {
            return Err(Error::InvalidTarget("Target cannot be empty".into()));
        }

        // Resolve hostname to IP
        let addr = tokio::net::lookup_host(format!("{}:80", target))
            .await
            .map_err(|e| Error::InvalidTarget(format!("DNS lookup failed: {}", e)))?
            .next()
            .ok_or_else(|| Error::InvalidTarget("No IP address found".into()))?;

        Ok(addr.ip().to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_validate_localhost() {
        let result = Capabilities::validate_target("localhost").await;
        assert!(result.is_ok());
        let ip = result.unwrap();
        assert!(ip == "127.0.0.1" || ip == "::1");
    }

    #[tokio::test]
    async fn test_validate_empty_target() {
        let result = Capabilities::validate_target("").await;
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("empty"));
    }

    #[tokio::test]
    async fn test_validate_invalid_hostname() {
        let result = Capabilities::validate_target("invalid.hostname.doesnotexist").await;
        assert!(result.is_err());
    }
}
```

## Mocking External Dependencies

### Using mockall

```rust
use mockall::predicate::*;
use mockall::*;

#[automock]
pub trait ToolExecutor {
    fn execute(&self, cmd: &str, args: &[&str]) -> Result<String>;
}

pub struct RealToolExecutor;

impl ToolExecutor for RealToolExecutor {
    fn execute(&self, cmd: &str, args: &[&str]) -> Result<String> {
        let output = std::process::Command::new(cmd)
            .args(args)
            .output()?;

        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    }
}

pub struct Scanner<T: ToolExecutor> {
    executor: T,
}

impl<T: ToolExecutor> Scanner<T> {
    pub fn new(executor: T) -> Self {
        Self { executor }
    }

    pub fn scan(&self, target: &str) -> Result<Vec<u16>> {
        let output = self.executor.execute("nmap", &["-p-", target])?;
        self.parse_output(&output)
    }

    fn parse_output(&self, output: &str) -> Result<Vec<u16>> {
        // Parse nmap output...
        Ok(vec![80, 443])
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_scan_with_mock() {
        let mut mock_executor = MockToolExecutor::new();
        mock_executor
            .expect_execute()
            .with(eq("nmap"), eq(&["-p-", "example.com"][..]))
            .times(1)
            .returning(|_, _| Ok("Discovered open port 80/tcp\nDiscovered open port 443/tcp".to_string()));

        let scanner = Scanner::new(mock_executor);
        let result = scanner.scan("example.com").unwrap();

        assert_eq!(result, vec![80, 443]);
    }

    #[test]
    fn test_scan_tool_failure() {
        let mut mock_executor = MockToolExecutor::new();
        mock_executor
            .expect_execute()
            .returning(|_, _| Err(Error::ToolNotFound("nmap".into())));

        let scanner = Scanner::new(mock_executor);
        let result = scanner.scan("example.com");

        assert!(result.is_err());
    }
}
```

### Mocking HTTP Services with wiremock

```rust
use wiremock::{MockServer, Mock, ResponseTemplate};
use wiremock::matchers::{method, path};

pub struct ApiClient {
    base_url: String,
    client: reqwest::Client,
}

impl ApiClient {
    pub fn new(base_url: String) -> Self {
        Self {
            base_url,
            client: reqwest::Client::new(),
        }
    }

    pub async fn get_vulnerabilities(&self, cve: &str) -> Result<Vec<String>> {
        let url = format!("{}/api/cve/{}", self.base_url, cve);
        let response = self.client
            .get(&url)
            .send()
            .await?;

        let vulns: Vec<String> = response.json().await?;
        Ok(vulns)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_get_vulnerabilities() {
        // Start mock server
        let mock_server = MockServer::start().await;

        // Configure mock response
        Mock::given(method("GET"))
            .and(path("/api/cve/CVE-2024-1234"))
            .respond_with(ResponseTemplate::new(200)
                .set_body_json(vec!["SQL Injection", "XSS"]))
            .mount(&mock_server)
            .await;

        // Test with mock
        let client = ApiClient::new(mock_server.uri());
        let result = client.get_vulnerabilities("CVE-2024-1234").await.unwrap();

        assert_eq!(result, vec!["SQL Injection", "XSS"]);
    }
}
```

## Integration Testing

### Testing the Full Connector

Create `tests/integration/test_connector.rs`:

```rust
use my_connector::*;
use strike48_connector_sdk::*;
use std::sync::Arc;
use tokio::time::{sleep, Duration};

#[tokio::test]
async fn test_connector_initialization() {
    let connector = MyConnector::new();
    assert!(connector.is_ok());
}

#[tokio::test]
async fn test_connector_type() {
    let connector = MyConnector::new().unwrap();
    assert_eq!(connector.connector_type(), "my-connector");
}

#[tokio::test]
async fn test_connector_version() {
    let connector = MyConnector::new().unwrap();
    assert!(!connector.version().is_empty());
}

#[tokio::test]
async fn test_capability_execution() {
    let connector = MyConnector::new().unwrap();

    let request = serde_json::json!({
        "target": "127.0.0.1",
        "timeout": 60
    });

    let result = connector.execute(request, Some("quick-scan")).await;
    assert!(result.is_ok());

    let response = result.unwrap();
    assert!(response.get("target").is_some());
}

#[tokio::test]
async fn test_unknown_capability() {
    let connector = MyConnector::new().unwrap();

    let request = serde_json::json!({});
    let result = connector.execute(request, Some("unknown-capability")).await;

    assert!(result.is_err());
}
```

### Testing with Temporary Files

```rust
use tempfile::TempDir;
use std::fs;

#[tokio::test]
async fn test_file_operations() {
    // Create temporary directory
    let temp_dir = TempDir::new().unwrap();
    let file_path = temp_dir.path().join("config.json");

    // Write test data
    let config = serde_json::json!({
        "target": "example.com",
        "ports": "80,443"
    });
    fs::write(&file_path, config.to_string()).unwrap();

    // Test connector with file
    let connector = MyConnector::from_file(&file_path).unwrap();
    assert_eq!(connector.target(), "example.com");

    // Temporary directory is automatically cleaned up
}
```

## Test Organization

### Shared Test Utilities

Create `tests/common/mod.rs`:

```rust
use my_connector::*;
use serde_json::Value;

/// Create test scan request
pub fn test_scan_request(target: &str) -> Value {
    serde_json::json!({
        "target": target,
        "ports": "80,443",
        "timeout": 60
    })
}

/// Create test connector
pub fn test_connector() -> MyConnector {
    MyConnector::new().expect("Failed to create test connector")
}

/// Assert scan result is valid
pub fn assert_valid_scan_result(result: &Value) {
    assert!(result.get("target").is_some());
    assert!(result.get("start_time").is_some());
    assert!(result.get("end_time").is_some());
    assert!(result.get("open_ports").is_some());
}
```

Use in tests:

```rust
mod common;

use common::*;

#[tokio::test]
async fn test_with_shared_utilities() {
    let connector = test_connector();
    let request = test_scan_request("localhost");
    let result = connector.execute(request, Some("quick-scan")).await.unwrap();
    assert_valid_scan_result(&result);
}
```

## Testing Error Scenarios

```rust
#[tokio::test]
async fn test_timeout_handling() {
    let connector = MyConnector::new().unwrap();

    let request = serde_json::json!({
        "target": "scanme.nmap.org",
        "timeout": 1  // Very short timeout
    });

    let result = connector.execute(request, Some("full-scan")).await;

    // Should timeout gracefully
    assert!(result.is_err() || result.unwrap().get("status").unwrap() == "partial");
}

#[tokio::test]
async fn test_invalid_input() {
    let connector = MyConnector::new().unwrap();

    let request = serde_json::json!({
        "target": "invalid; target"  // Command injection attempt
    });

    let result = connector.execute(request, Some("quick-scan")).await;
    assert!(result.is_err());
}

#[tokio::test]
async fn test_missing_required_field() {
    let connector = MyConnector::new().unwrap();

    let request = serde_json::json!({
        // Missing "target" field
        "timeout": 60
    });

    let result = connector.execute(request, Some("quick-scan")).await;
    assert!(result.is_err());
}
```

## Running Tests

### Run All Tests

```bash
cargo test
```

### Run Specific Test

```bash
cargo test test_parse_single_port
```

### Run Tests with Output

```bash
cargo test -- --nocapture
```

### Run Tests in Parallel

```bash
cargo test -- --test-threads=4
```

### Run Integration Tests Only

```bash
cargo test --test integration
```

### Run with Coverage

Install tarpaulin:
```bash
cargo install cargo-tarpaulin
```

Generate coverage report:
```bash
cargo tarpaulin --out Html
```

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Install Rust
      uses: actions-rs/toolchain@v1
      with:
        toolchain: stable
        override: true

    - name: Install nmap
      run: sudo apt-get update && sudo apt-get install -y nmap

    - name: Run tests
      run: cargo test --verbose

    - name: Run clippy
      run: cargo clippy -- -D warnings

    - name: Check formatting
      run: cargo fmt -- --check

  coverage:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Install tarpaulin
      run: cargo install cargo-tarpaulin

    - name: Generate coverage
      run: cargo tarpaulin --out Xml

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./cobertura.xml
```

## Best Practices

### ✅ Do

- **Write tests first** - TDD helps design better APIs
- **Test error paths** - Don't just test the happy path
- **Use descriptive names** - `test_parse_invalid_port_range` > `test_parse_error`
- **Keep tests independent** - Each test should run in isolation
- **Mock external dependencies** - Tests should be fast and reliable
- **Test edge cases** - Empty strings, max values, special characters
- **Use code coverage** - Aim for 80%+ coverage

### ❌ Don't

- **Test implementation details** - Test behavior, not internals
- **Share state between tests** - Avoid global state
- **Make tests slow** - Mock external services
- **Ignore flaky tests** - Fix or remove them
- **Write fragile tests** - Tests shouldn't break on refactoring

## Example: Complete Test Suite

See the complete test suite for the port scanner connector:
- [Unit Tests](https://github.com/Strike48/sdk-rs/blob/main/examples/port-scanner/tests/unit/)
- [Integration Tests](https://github.com/Strike48/sdk-rs/blob/main/examples/port-scanner/tests/integration/)

## Next Steps

- [Error Handling Patterns](/developers/sdk-rs/guides/error-handling/) - Robust error handling
- [Async Patterns](/developers/sdk-rs/guides/async-patterns/) - Tokio best practices
- [Building Your First Connector](/developers/sdk-rs/guides/building-your-first-connector/) - Complete tutorial

## Resources

- [Rust Testing Book](https://doc.rust-lang.org/book/ch11-00-testing.html)
- [mockall Documentation](https://docs.rs/mockall/)
- [tokio-test Documentation](https://docs.rs/tokio-test/)
- [tarpaulin Documentation](https://github.com/xd009642/tarpaulin)
