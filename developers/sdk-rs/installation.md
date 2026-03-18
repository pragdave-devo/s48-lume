---
title: Installation
description: Install the Strike48 SDK for Rust and set up your development environment
nav_order: 3
parent: "For Developers"
---

# Installation

This guide walks you through installing the Strike48 SDK for Rust in your project.

## Prerequisites

Before installing the SDK, ensure you have the following installed:

### Rust Toolchain

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Verify installation
rustc --version
cargo --version
```

The SDK requires **Rust 1.70 or later**.

### Protocol Buffers Compiler

The SDK uses Protocol Buffers for efficient serialization. Install `protoc`:

**macOS:**
```bash
brew install protobuf
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt update
sudo apt install protobuf-compiler
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install protobuf-compiler
```

**Verify installation:**
```bash
protoc --version
# Should output: libprotoc 3.x.x or later
```

## Installation Methods

Choose the installation method that best fits your use case:

### Method 1: From GitHub (Recommended)

This is the recommended method for internal Strike48 projects.

Add to your `Cargo.toml`:

```toml
[dependencies]
strike48-connector-sdk = {
    git = "https://github.com/Strike48/sdk-rs"
}
```

**For a specific version/tag:**

```toml
[dependencies]
strike48-connector-sdk = {
    git = "https://github.com/Strike48/sdk-rs",
    tag = "v0.1.0"
}
```

**For a specific branch:**

```toml
[dependencies]
strike48-connector-sdk = {
    git = "https://github.com/Strike48/sdk-rs",
    branch = "develop"
}
```

### Method 2: From Crates.io (Coming Soon)

Once published to crates.io, you can install with:

```toml
[dependencies]
strike48-connector-sdk = "0.1.0"
```

### Method 3: From Local Path (Development)

For local development and testing:

```toml
[dependencies]
strike48-connector-sdk = { path = "../sdk-rs" }
```

## Authentication for Private Repositories

If you're accessing a private GitHub repository, you need to configure Git authentication.

### Option 1: SSH (Recommended)

SSH is the recommended method as it's more secure and easier to manage.

```bash
# Ensure your SSH key is added to your GitHub account
ssh-add ~/.ssh/id_rsa

# Update Cargo.toml to use SSH
[dependencies]
strike48-connector-sdk = {
    git = "ssh://git@github.com/Strike48/sdk-rs"
}
```

### Option 2: Personal Access Token via .netrc

```bash
# Create or edit ~/.netrc
cat >> ~/.netrc << EOF
machine github.com
login YOUR_GITHUB_USERNAME
password YOUR_GITHUB_TOKEN
EOF

# Secure the file
chmod 600 ~/.netrc
```

### Option 3: Git Credential Helper

```bash
# Configure git to store credentials
git config --global credential.helper store

# Next time you run cargo build, you'll be prompted for credentials
```

## Verifying Installation

Create a new Rust project to verify the installation:

```bash
# Create a new project
cargo new my-connector
cd my-connector

# Add the SDK to Cargo.toml (use one of the methods above)
```

Edit `Cargo.toml`:

```toml
[package]
name = "my-connector"
version = "0.1.0"
edition = "2021"

[dependencies]
strike48-connector-sdk = { git = "https://github.com/Strike48/sdk-rs" }
tokio = { version = "1", features = ["full"] }
serde_json = "1"
chrono = "0.4"
```

Build the project:

```bash
cargo build
```

If the build succeeds, the SDK is installed correctly!

## Build Configuration

The SDK uses `tonic-build` in `build.rs` to automatically generate protobuf stubs during compilation. No manual proto generation is needed.

### Build Time

The first build will take longer as it:
1. Downloads dependencies
2. Compiles the SDK and all dependencies
3. Generates protobuf stubs via `build.rs`

Subsequent builds will be much faster thanks to Cargo's incremental compilation.

## Troubleshooting

### Protocol Buffers Compiler Not Found

**Error:**
```
error: failed to run custom build command for `strike48-connector-sdk`
...
Could not find `protoc` installation
```

**Solution:** Install `protoc` as described in the Prerequisites section.

### Private Repository Access Denied

**Error:**
```
Updating git repository `https://github.com/Strike48/sdk-rs`
fatal: could not read Username for 'https://github.com': terminal prompts disabled
```

**Solution:** Configure Git authentication using one of the methods in the "Authentication for Private Repositories" section.

### Rust Version Too Old

**Error:**
```
error: package `strike48-connector-sdk` requires rustc 1.70.0 or newer
```

**Solution:** Update Rust:
```bash
rustup update stable
```

### Network Issues

If you experience network issues during installation:

```bash
# Try with verbose output to see what's happening
cargo build -vv

# Or use a specific registry mirror (if behind corporate proxy)
export CARGO_NET_GIT_FETCH_WITH_CLI=true
```

## Next Steps

Now that you have the SDK installed, you're ready to build your first connector!

Continue to the [Quick Start Guide](./quick-start.md) to create a simple echo connector.

## Additional Resources

- [Rust Book](https://doc.rust-lang.org/book/) - Learn Rust fundamentals
- [Tokio Documentation](https://tokio.rs/) - Learn async Rust
- [Protocol Buffers](https://protobuf.dev/) - Learn about Protocol Buffers
