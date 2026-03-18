---
title: Installation
description: Build and run Pick from source.
nav_order: 4
parent: "Pick"
---

[**Download latest release from GitHub →**](https://github.com/strike48-public/pick/releases)

## Quick Start (Desktop)

```bash
git clone https://github.com/Strike48-public/pick.git
cd pick
cargo build --release --package pentest-desktop
```

The binary is produced at `./target/release/pentest-desktop`.

---

## Prerequisites

- **Rust 1.70+** with `cargo`
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```

### Platform-Specific Requirements

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install libwebkit2gtk-4.1-dev \
  build-essential curl wget file \
  libssl-dev libayatana-appindicator3-dev librsvg2-dev

# Fedora
sudo dnf install webkit2gtk4.1-devel \
  openssl-devel curl wget file \
  libappindicator-gtk3-devel librsvg2-devel
```

**macOS:**
```bash
xcode-select --install
```

**Windows:**
- Microsoft Visual Studio C++ Build Tools
- WebView2 Runtime (usually pre-installed on Windows 10+)

## Other Build Targets

### Web (LiveView)

```bash
cargo run --package pentest-web
# Starts server on http://localhost:3000
```

### Terminal (TUI)

```bash
cargo run --package pentest-tui
```

### Mobile

Install cargo-mobile2 first:
```bash
cargo install cargo-mobile2
```

**Android:**
```bash
cd apps/mobile && cargo mobile init
cargo mobile android build --release
```

**iOS (macOS only):**
```bash
cd apps/mobile && cargo mobile init
cargo mobile ios build --release
```

## Troubleshooting

**Build errors on Linux** — Ensure all development packages are installed:
```bash
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev
```

**macOS WebView issues:**
```bash
sudo rm -rf /Library/Developer/CommandLineTools
xcode-select --install
```

**Rust version issues:**
```bash
rustup update stable
rustup default stable
```

**Mobile build failures:**
```bash
cargo mobile doctor
```

## Next Steps

- [Configuration Guide](./configuration.md) — Learn how to configure the connector
- [Architecture Documentation](../architecture.md) — Understand the project structure
