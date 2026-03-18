---
title: Async Patterns with Tokio
description: Best practices for asynchronous programming in Strike48 connectors using Tokio runtime.
nav_order: 9
parent: "For Developers"
---

Asynchronous programming is essential for building efficient, scalable connectors. This guide covers Tokio patterns, concurrency strategies, and best practices for Strike48 connector development.

## Why Async?

Strike48 connectors are inherently I/O-bound:
- Waiting for network responses
- Executing external tools
- Reading/writing files
- Database queries

**Async programming** allows handling thousands of concurrent operations without blocking threads.

## Tokio Basics

### The Tokio Runtime

Tokio is the async runtime used by Strike48 SDK:

```rust
#[tokio::main]
async fn main() -> Result<()> {
    // Tokio runtime is automatically initialized
    run_connector().await
}
```

### Async Functions

```rust
// Async function definition
async fn scan_target(target: &str) -> Result<ScanResult> {
    // Async operations with .await
    let result = perform_scan(target).await?;
    Ok(result)
}

// Calling async functions
#[tokio::main]
async fn main() {
    let result = scan_target("192.168.1.1").await;
}
```

### Futures and .await

```rust
use tokio::time::{sleep, Duration};

async fn delayed_scan(target: &str) -> Result<ScanResult> {
    // Wait for 1 second (non-blocking)
    sleep(Duration::from_secs(1)).await;

    // Perform the scan
    scan(target).await
}
```

## Concurrency Patterns

### Running Tasks in Parallel

Use `tokio::spawn` for concurrent execution:

```rust
use tokio::task;

async fn scan_multiple_targets(targets: Vec<String>) -> Result<Vec<ScanResult>> {
    let mut handles = Vec::new();

    // Spawn tasks for parallel execution
    for target in targets {
        let handle = task::spawn(async move {
            scan_target(&target).await
        });
        handles.push(handle);
    }

    // Wait for all tasks to complete
    let mut results = Vec::new();
    for handle in handles {
        match handle.await {
            Ok(Ok(result)) => results.push(result),
            Ok(Err(e)) => tracing::warn!("Scan failed: {}", e),
            Err(e) => tracing::error!("Task panicked: {}", e),
        }
    }

    Ok(results)
}
```

### Using join! for Fixed Concurrency

When you have a fixed number of async operations:

```rust
use tokio::join;

async fn perform_recon(target: &str) -> Result<ReconResult> {
    // Run multiple scans concurrently
    let (port_scan, service_scan, vuln_scan) = join!(
        scan_ports(target),
        detect_services(target),
        check_vulnerabilities(target),
    );

    Ok(ReconResult {
        ports: port_scan?,
        services: service_scan?,
        vulnerabilities: vuln_scan?,
    })
}
```

### Using try_join! for Early Exit

Stop all operations if any fails:

```rust
use tokio::try_join;

async fn validate_and_scan(target: &str) -> Result<ScanResult> {
    // All must succeed, or early exit
    let (dns_result, ping_result, scan_result) = try_join!(
        resolve_dns(target),
        ping_target(target),
        scan_ports(target),
    )?;

    Ok(ScanResult {
        dns: dns_result,
        ping: ping_result,
        ports: scan_result,
    })
}
```

### Using select! for Racing Operations

Execute multiple operations, use the first to complete:

```rust
use tokio::select;
use tokio::time::{sleep, Duration};

async fn scan_with_timeout(target: &str, timeout: u64) -> Result<ScanResult> {
    select! {
        result = scan_ports(target) => {
            result
        }
        _ = sleep(Duration::from_secs(timeout)) => {
            Err(ConnectorError::Timeout { duration: timeout })
        }
    }
}
```

## Concurrency Limiting

### Using Semaphore

Limit concurrent operations to prevent resource exhaustion:

```rust
use tokio::sync::Semaphore;
use std::sync::Arc;

pub struct Scanner {
    semaphore: Arc<Semaphore>,
}

impl Scanner {
    pub fn new(max_concurrent: usize) -> Self {
        Self {
            semaphore: Arc::new(Semaphore::new(max_concurrent)),
        }
    }

    pub async fn scan_targets(&self, targets: Vec<String>) -> Vec<ScanResult> {
        let mut handles = Vec::new();

        for target in targets {
            let semaphore = self.semaphore.clone();

            let handle = tokio::spawn(async move {
                // Acquire permit before scanning
                let _permit = semaphore.acquire().await.unwrap();

                // Only max_concurrent scans run at once
                scan_target(&target).await
            });

            handles.push(handle);
        }

        // Collect results
        let mut results = Vec::new();
        for handle in handles {
            if let Ok(Ok(result)) = handle.await {
                results.push(result);
            }
        }

        results
    }
}

// Usage
let scanner = Scanner::new(10); // Max 10 concurrent scans
let results = scanner.scan_targets(targets).await;
```

### Using FuturesUnordered

Process results as they complete:

```rust
use futures::stream::{FuturesUnordered, StreamExt};

async fn scan_targets_streaming(targets: Vec<String>) -> Result<Vec<ScanResult>> {
    let mut futures = FuturesUnordered::new();

    // Create futures for all targets
    for target in targets {
        futures.push(scan_target(target));
    }

    // Process results as they complete
    let mut results = Vec::new();
    while let Some(result) = futures.next().await {
        match result {
            Ok(scan_result) => {
                tracing::info!("Scan completed: {}", scan_result.target);
                results.push(scan_result);
            }
            Err(e) => tracing::warn!("Scan failed: {}", e),
        }
    }

    Ok(results)
}
```

## Channels for Communication

### Using mpsc for Producer-Consumer

```rust
use tokio::sync::mpsc;

async fn scan_with_progress(
    targets: Vec<String>,
) -> (mpsc::Receiver<ScanProgress>, tokio::task::JoinHandle<Result<Vec<ScanResult>>>) {
    let (tx, rx) = mpsc::channel(100);

    let handle = tokio::spawn(async move {
        let mut results = Vec::new();

        for (i, target) in targets.iter().enumerate() {
            // Send progress update
            let _ = tx.send(ScanProgress {
                current: i + 1,
                total: targets.len(),
                target: target.clone(),
            }).await;

            // Perform scan
            match scan_target(target).await {
                Ok(result) => results.push(result),
                Err(e) => tracing::warn!("Scan failed for {}: {}", target, e),
            }
        }

        Ok(results)
    });

    (rx, handle)
}

// Usage
let (mut progress_rx, scan_handle) = scan_with_progress(targets).await;

// Receive progress updates
tokio::spawn(async move {
    while let Some(progress) = progress_rx.recv().await {
        println!("Progress: {}/{} - {}", progress.current, progress.total, progress.target);
    }
});

// Wait for completion
let results = scan_handle.await??;
```

### Using broadcast for Fan-Out

```rust
use tokio::sync::broadcast;

pub struct ScanCoordinator {
    event_tx: broadcast::Sender<ScanEvent>,
}

impl ScanCoordinator {
    pub fn new() -> Self {
        let (tx, _) = broadcast::channel(100);
        Self { event_tx: tx }
    }

    pub fn subscribe(&self) -> broadcast::Receiver<ScanEvent> {
        self.event_tx.subscribe()
    }

    pub async fn scan_target(&self, target: String) -> Result<ScanResult> {
        // Notify start
        let _ = self.event_tx.send(ScanEvent::Started(target.clone()));

        // Perform scan
        let result = match perform_scan(&target).await {
            Ok(r) => {
                let _ = self.event_tx.send(ScanEvent::Completed(target.clone()));
                r
            }
            Err(e) => {
                let _ = self.event_tx.send(ScanEvent::Failed(target.clone(), e.to_string()));
                return Err(e);
            }
        };

        Ok(result)
    }
}

// Multiple subscribers can listen
let coordinator = ScanCoordinator::new();

let mut subscriber1 = coordinator.subscribe();
let mut subscriber2 = coordinator.subscribe();

tokio::spawn(async move {
    while let Ok(event) = subscriber1.recv().await {
        println!("Subscriber 1: {:?}", event);
    }
});

tokio::spawn(async move {
    while let Ok(event) = subscriber2.recv().await {
        println!("Subscriber 2: {:?}", event);
    }
});
```

## Blocking Operations

### Never Block the Async Runtime

❌ **Bad**: Blocking the runtime
```rust
async fn bad_example() {
    // This blocks the entire async runtime!
    std::thread::sleep(Duration::from_secs(1));
}
```

✅ **Good**: Use async sleep
```rust
async fn good_example() {
    // Non-blocking sleep
    tokio::time::sleep(Duration::from_secs(1)).await;
}
```

### spawn_blocking for CPU-Intensive Work

```rust
use tokio::task;

async fn parse_large_file(path: &str) -> Result<Vec<Record>> {
    let path = path.to_string();

    // Run CPU-intensive work in a thread pool
    let records = task::spawn_blocking(move || {
        // This runs on a dedicated thread pool
        std::fs::read_to_string(&path)
            .map(|content| parse_records(&content))
    })
    .await??;

    Ok(records)
}
```

### Wrapping Sync Code

```rust
async fn execute_nmap(target: &str) -> Result<String> {
    let target = target.to_string();

    // Run sync process in blocking thread pool
    let output = tokio::task::spawn_blocking(move || {
        std::process::Command::new("nmap")
            .arg(&target)
            .output()
    })
    .await??;

    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}
```

## Timeouts and Cancellation

### Adding Timeouts

```rust
use tokio::time::{timeout, Duration};

async fn scan_with_timeout(target: &str) -> Result<ScanResult> {
    match timeout(Duration::from_secs(300), scan_target(target)).await {
        Ok(result) => result,
        Err(_) => Err(ConnectorError::Timeout { duration: 300 }),
    }
}
```

### Graceful Cancellation

```rust
use tokio::sync::watch;
use tokio::select;

pub struct CancellableScanner {
    cancel_tx: watch::Sender<bool>,
}

impl CancellableScanner {
    pub fn new() -> Self {
        let (tx, _) = watch::channel(false);
        Self { cancel_tx: tx }
    }

    pub async fn scan_targets(
        &self,
        targets: Vec<String>,
    ) -> Result<Vec<ScanResult>> {
        let mut cancel_rx = self.cancel_tx.subscribe();
        let mut results = Vec::new();

        for target in targets {
            select! {
                result = scan_target(&target) => {
                    results.push(result?);
                }
                _ = cancel_rx.changed() => {
                    tracing::info!("Scan cancelled");
                    break;
                }
            }
        }

        Ok(results)
    }

    pub fn cancel(&self) {
        let _ = self.cancel_tx.send(true);
    }
}
```

## State Management

### Sharing State with Arc

```rust
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Clone)]
pub struct ScannerState {
    results: Arc<RwLock<Vec<ScanResult>>>,
    stats: Arc<RwLock<ScanStats>>,
}

impl ScannerState {
    pub fn new() -> Self {
        Self {
            results: Arc::new(RwLock::new(Vec::new())),
            stats: Arc::new(RwLock::new(ScanStats::default())),
        }
    }

    pub async fn add_result(&self, result: ScanResult) {
        let mut results = self.results.write().await;
        results.push(result);

        let mut stats = self.stats.write().await;
        stats.total_scans += 1;
    }

    pub async fn get_stats(&self) -> ScanStats {
        self.stats.read().await.clone()
    }
}

// Usage: Clone and share across tasks
let state = ScannerState::new();

for target in targets {
    let state = state.clone();
    tokio::spawn(async move {
        let result = scan_target(&target).await.unwrap();
        state.add_result(result).await;
    });
}
```

### Using Mutex vs RwLock

```rust
use tokio::sync::{Mutex, RwLock};

// Use Mutex for short, exclusive access
let counter = Arc::new(Mutex::new(0));
{
    let mut count = counter.lock().await;
    *count += 1;
} // Lock released

// Use RwLock for many readers, few writers
let cache = Arc::new(RwLock::new(HashMap::new()));

// Many concurrent readers
let data = cache.read().await;
let value = data.get(&key);

// Exclusive writer
let mut data = cache.write().await;
data.insert(key, value);
```

## Stream Processing

### Processing Items as They Arrive

```rust
use futures::stream::{self, StreamExt};

async fn process_scan_stream(targets: Vec<String>) -> Result<()> {
    // Create stream of targets
    let stream = stream::iter(targets)
        .map(|target| async move {
            scan_target(&target).await
        })
        .buffer_unordered(10); // Process up to 10 concurrently

    // Process results as they complete
    tokio::pin!(stream);
    while let Some(result) = stream.next().await {
        match result {
            Ok(scan_result) => {
                tracing::info!("Processed: {}", scan_result.target);
                // Handle result
            }
            Err(e) => tracing::warn!("Scan failed: {}", e),
        }
    }

    Ok(())
}
```

### Transforming Streams

```rust
use futures::stream::{self, StreamExt, TryStreamExt};

async fn scan_and_filter(targets: Vec<String>) -> Result<Vec<ScanResult>> {
    stream::iter(targets)
        .map(Ok)
        .try_for_each_concurrent(5, |target| async move {
            scan_target(&target).await
        })
        .await?;

    // Or with transformations
    let results: Vec<_> = stream::iter(targets)
        .then(|target| scan_target(target))
        .filter_map(|result| async move { result.ok() })
        .filter(|result| async move { !result.open_ports.is_empty() })
        .collect()
        .await;

    Ok(results)
}
```

## Background Tasks

### Long-Running Background Task

```rust
use tokio::sync::mpsc;

pub struct BackgroundScanner {
    tx: mpsc::Sender<String>,
}

impl BackgroundScanner {
    pub fn start() -> Self {
        let (tx, mut rx) = mpsc::channel::<String>(100);

        // Spawn background task
        tokio::spawn(async move {
            while let Some(target) = rx.recv().await {
                match scan_target(&target).await {
                    Ok(result) => {
                        tracing::info!("Background scan completed: {}", target);
                        // Store result somewhere
                    }
                    Err(e) => {
                        tracing::error!("Background scan failed: {}", e);
                    }
                }
            }
        });

        Self { tx }
    }

    pub async fn queue_scan(&self, target: String) -> Result<()> {
        self.tx.send(target).await
            .map_err(|_| ConnectorError::ChannelClosed)?;
        Ok(())
    }
}
```

### Periodic Tasks

```rust
use tokio::time::{interval, Duration};

async fn periodic_cleanup() {
    let mut interval = interval(Duration::from_secs(3600));

    loop {
        interval.tick().await;

        // Run cleanup every hour
        if let Err(e) = cleanup_old_results().await {
            tracing::error!("Cleanup failed: {}", e);
        }
    }
}

// Start background task
tokio::spawn(periodic_cleanup());
```

## Best Practices

### ✅ Do

- **Use async for I/O operations** - Network, filesystem, database
- **Limit concurrency** - Use semaphores to prevent resource exhaustion
- **Use spawn_blocking for CPU work** - Don't block the runtime
- **Handle cancellation** - Support graceful shutdown
- **Add timeouts** - Prevent hanging operations
- **Use channels for communication** - Don't share mutable state directly
- **Process streams incrementally** - Don't buffer everything in memory
- **Clone Arc, not data** - Share ownership efficiently

### ❌ Don't

- **Don't use std::thread::sleep** - Use tokio::time::sleep
- **Don't hold locks across .await** - Causes deadlocks
- **Don't spawn unlimited tasks** - Use bounded concurrency
- **Don't panic in async code** - Use Result for errors
- **Don't block without spawn_blocking** - Blocks entire runtime
- **Don't ignore task join handles** - Tasks can panic silently

## Common Pitfalls

### Holding Locks Across Await

❌ **Bad**: Deadlock risk
```rust
async fn bad() {
    let mut data = mutex.lock().await;
    expensive_async_operation().await; // Lock held during await!
    data.insert("key", "value");
}
```

✅ **Good**: Release lock before await
```rust
async fn good() {
    let value = {
        let data = mutex.lock().await;
        data.get("key").cloned()
    }; // Lock released

    let result = expensive_async_operation().await;

    {
        let mut data = mutex.lock().await;
        data.insert("key", result);
    } // Lock released
}
```

### Spawning Too Many Tasks

❌ **Bad**: Unbounded concurrency
```rust
async fn bad(targets: Vec<String>) {
    let mut handles = Vec::new();
    for target in targets {
        // Could spawn thousands of tasks!
        handles.push(tokio::spawn(scan(target)));
    }
    // ...
}
```

✅ **Good**: Bounded concurrency
```rust
async fn good(targets: Vec<String>) {
    let semaphore = Arc::new(Semaphore::new(10));
    let mut handles = Vec::new();

    for target in targets {
        let sem = semaphore.clone();
        handles.push(tokio::spawn(async move {
            let _permit = sem.acquire().await;
            scan(target).await
        }));
    }
    // ...
}
```

## Next Steps

- [Building Your First Connector](/developers/sdk-rs/guides/building-your-first-connector/) - Apply async patterns
- [Error Handling](/developers/sdk-rs/guides/error-handling/) - Handle async errors
- [Testing Connectors](/developers/sdk-rs/guides/testing-connectors/) - Test async code

## Resources

- [Tokio Tutorial](https://tokio.rs/tokio/tutorial)
- [Async Book](https://rust-lang.github.io/async-book/)
- [Tokio API Documentation](https://docs.rs/tokio/)
- [Futures Documentation](https://docs.rs/futures/)
