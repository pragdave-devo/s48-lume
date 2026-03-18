---
title: Installation
description: Build and run StrikeHub from source.
nav_order: 3
parent: "StrikeHub"
---

[**Download latest release from GitHub →**](https://github.com/strike48-public/strikehub/releases)

## Quick Start

```bash
git clone https://github.com/Strike48-public/strikehub.git
cd strikehub
cargo run --features desktop
```

For a release build:

```bash
cargo build --release --features desktop
```

The binary is produced at `./target/release/strikehub`.

---

## System Requirements

| Requirement | Details |
|-------------|---------|
| OS | macOS (primary), Linux (secondary) |
| Rust | 1.91.1+ (edition 2024) |
| Disk | ~500 MB for build artifacts |

## Install Rust

If you don't have Rust installed:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Verify the installation:

```bash
rustc --version
# rustc 1.91.1 or later
```

## macOS Notes

StrikeHub uses Wry for its WebView, which relies on WebKit on macOS. No additional dependencies are needed — WebKit ships with the system.

## Linux Notes

On Linux, you need the following system packages for WebView support:

```bash
# Debian/Ubuntu
sudo apt install -y libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev

# Fedora
sudo dnf install webkit2gtk4.1-devel gtk3-devel libappindicator-gtk3-devel
```

## Running Tests

```bash
cargo test --workspace
```

## Troubleshooting

- **Build fails on missing WebKit** — Install the WebView development libraries for your platform (see Linux Notes above).
- **Rust version too old** — Run `rustup update` to get the latest stable toolchain.
- **Feature `desktop` not found** — Make sure you're in the workspace root and the feature is defined in `sh-ui/Cargo.toml`.
