---
title: Quick Start
description: Build your first Strike48 connector in 5 minutes
nav_order: 4
parent: "For Developers"
---

# Quick Start

Build your first connector in less than 5 minutes! This tutorial walks you through creating a simple echo connector that returns whatever you send to it.

## Create a New Project

```bash
cargo new echo-connector
cd echo-connector
```

## Add Dependencies

Edit `Cargo.toml`:

```toml
[package]
name = "echo-connector"
version = "0.1.0"
edition = "2021"

[dependencies]
strike48-connector-sdk = { git = "https://github.com/Strike48/sdk-rs" }
tokio = { version = "1", features = ["full"] }
serde_json = "1"
chrono = "0.4"
```

## Implement Your Connector

Replace the contents of `src/main.rs` with:

```rust
use strike48_connector_sdk::*;
use std::sync::Arc;

// Define your connector struct
struct EchoConnector;

// Implement the BaseConnector trait
impl BaseConnector for EchoConnector {
    // Return the connector type identifier
    fn connector_type(&self) -> &str {
        "echo"
    }

    // Return the connector version
    fn version(&self) -> &str {
        "1.0.0"
    }

    // Handle execution requests
    fn execute(
        &self,
        request: serde_json::Value,
        _capability_id: Option<&str>,
    ) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<serde_json::Value>> + Send>> {
        Box::pin(async move {
            // Echo back the request with a timestamp
            Ok(serde_json::json!({
                "success": true,
                "echo": request,
                "timestamp": chrono::Utc::now().to_rfc3339()
            }))
        })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging (optional but recommended)
    init_logger();

    // Configure the connector
    let config = ConnectorConfig {
        matrix_host: "localhost:50061".to_string(),
        tenant_id: "default".to_string(),
        connector_type: "echo".to_string(),
        instance_id: format!("echo-{}", chrono::Utc::now().timestamp_millis()),
        version: "1.0.0".to_string(),
        auth_token: String::new(),
        use_tls: false,
        ..ConnectorConfig::default()
    };

    // Create and run the connector
    let connector = Arc::new(EchoConnector);
    let runner = ConnectorRunner::new(config, connector);

    runner.run().await?;
    Ok(())
}
```

## Understanding the Code

Let's break down what each part does:

### 1. The Connector Struct

```rust
struct EchoConnector;
```

This is your connector's state. For simple connectors, it can be empty. For complex connectors, you might store configuration, connections, or other state here.

### 2. The BaseConnector Trait

```rust
impl BaseConnector for EchoConnector {
    fn connector_type(&self) -> &str { "echo" }
    fn version(&self) -> &str { "1.0.0" }
    fn execute(...) -> ... { ... }
}
```

This trait defines the interface your connector must implement:
- `connector_type()` - Unique identifier for your connector type
- `version()` - Semantic version of your connector
- `execute()` - Async function that processes requests

### 3. Configuration

```rust
let config = ConnectorConfig {
    matrix_host: "localhost:50061".to_string(),
    tenant_id: "default".to_string(),
    connector_type: "echo".to_string(),
    instance_id: format!("echo-{}", chrono::Utc::now().timestamp_millis()),
    version: "1.0.0".to_string(),
    auth_token: String::new(),
    use_tls: false,
    ..ConnectorConfig::default()
};
```

Key configuration fields:
- `matrix_host` - Prospector Studio server URL
- `tenant_id` - Your tenant identifier
- `connector_type` - Must match `connector_type()` method
- `instance_id` - Unique ID for this connector instance
- `auth_token` - Leave empty to use approval flow

### 4. Running the Connector

```rust
let connector = Arc::new(EchoConnector);
let runner = ConnectorRunner::new(config, connector);
runner.run().await?;
```

The `ConnectorRunner` manages the lifecycle:
1. Connects to Prospector Studio
2. Handles authentication
3. Routes requests to your `execute()` method
4. Manages reconnection on failures

## Build and Run

```bash
# Build the connector
cargo build

# Set environment variables (optional - will use config defaults)
export MATRIX_HOST=localhost:50061
export TENANT_ID=default

# Run the connector
cargo run
```

You should see output like:

```
INFO  Connecting to Prospector Studio at localhost:50061
INFO  Connector registered: echo (instance: echo-1709478901234)
INFO  Waiting for approval...
```

## Test Your Connector

### Step 1: Approve the Connector

Open Prospector Studio and approve the pending connector connection.

### Step 2: Send a Test Request

From Prospector Studio or using the API, send a test request:

```json
{
  "message": "Hello, Echo!",
  "data": {
    "value": 42
  }
}
```

### Step 3: View the Response

You should receive:

```json
{
  "success": true,
  "echo": {
    "message": "Hello, Echo!",
    "data": {
      "value": 42
    }
  },
  "timestamp": "2026-03-03T14:15:30.123Z"
}
```

## Using Environment Variables

Instead of hardcoding configuration, use environment variables:

```rust
#[tokio::main]
async fn main() -> Result<()> {
    init_logger();

    // Load configuration from environment
    let config = ConnectorConfig::from_env();

    let connector = Arc::new(EchoConnector);
    let runner = ConnectorRunner::new(config, connector);

    runner.run().await?;
    Ok(())
}
```

Then set environment variables:

```bash
export MATRIX_HOST=localhost:50061
export TENANT_ID=default
export CONNECTOR_TYPE=echo
export INSTANCE_ID=echo-prod
export USE_TLS=false

cargo run
```

## Adding Logging

The SDK uses the `tracing` crate for structured logging. Control log level:

```bash
# Show all logs
RUST_LOG=debug cargo run

# Show only errors and warnings
RUST_LOG=warn cargo run

# Show logs for specific modules
RUST_LOG=strike48_connector_sdk=debug cargo run
```

## Error Handling

Add proper error handling to your execute function:

```rust
fn execute(
    &self,
    request: serde_json::Value,
) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<serde_json::Value>> + Send>> {
    Box::pin(async move {
        // Validate input
        let message = request.get("message")
            .and_then(|v| v.as_str())
            .ok_or_else(|| {
                ConnectorError::new(
                    ErrorCode::InvalidInput,
                    "Missing 'message' field"
                )
            })?;

        // Process the request
        Ok(serde_json::json!({
            "success": true,
            "echo": message,
            "length": message.len(),
            "timestamp": chrono::Utc::now().to_rfc3339()
        }))
    })
}
```

## Next Steps

Congratulations! You've built your first connector. Here are some next steps:

1. **Learn about [Configuration](./configuration.md)** - Explore advanced configuration options
2. **Add capabilities** - Define specific capabilities your connector supports
3. **Handle WebSocket frames** - Build real-time streaming connectors
4. **Execute processes** - Use the built-in process execution utilities
5. **Browse examples** - Check the `examples/` directory in the SDK repository

## Common Patterns

### Stateful Connectors

```rust
struct DatabaseConnector {
    pool: sqlx::PgPool,
}

impl BaseConnector for DatabaseConnector {
    fn execute(&self, request: serde_json::Value) -> ... {
        let pool = self.pool.clone();
        Box::pin(async move {
            // Use the connection pool
            let result = sqlx::query("SELECT * FROM users")
                .fetch_all(&pool)
                .await?;
            Ok(serde_json::to_value(result)?)
        })
    }
}
```

### Multiple Capabilities

```rust
impl BaseConnector for MyConnector {
    fn execute(&self, request: serde_json::Value, capability_id: Option<&str>) -> ... {
        Box::pin(async move {
            match capability_id {
                Some("list") => self.handle_list(request).await,
                Some("create") => self.handle_create(request).await,
                Some("delete") => self.handle_delete(request).await,
                _ => Err(ConnectorError::new(
                    ErrorCode::InvalidInput,
                    "Unknown capability"
                ))
            }
        })
    }
}
```

## Troubleshooting

### Connection Refused

```
Error: Failed to connect to Prospector Studio
```

**Solution:** Ensure Prospector Studio is running at the configured host/port.

### Authentication Failed

```
Error: Authentication failed
```

**Solution:**
1. Check that you've approved the connector in Prospector Studio
2. Verify your `tenant_id` is correct
3. Ensure the connector isn't already registered with a different instance_id

### Build Errors

```
error: could not compile `echo-connector`
```

**Solution:** Ensure you have all prerequisites installed (see [Installation](./installation.md)).

## Resources

- [Configuration Guide](./configuration.md) - Detailed configuration options
- [SDK Examples](https://github.com/Strike48/sdk-rs/tree/main/examples) - More example connectors
- [API Documentation](https://github.com/Strike48/sdk-rs) - Full API reference
