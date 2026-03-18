---
title: Installation
description: Build and run KubeStudio from source.
nav_order: 3
parent: "KubeStudio"
---

[**Download latest release from GitHub →**](https://github.com/strike48-public/kubestudio/releases)

## Install KubeStudio

Clone the repo, build, and run — that's it.

```bash
git clone https://github.com/Strike48-public/kubestudio.git && cd kubestudio && cargo run --release
```

The binary is produced at `./target/release/studio-kube-desktop`.

> **Tip:** Need Rust? Run `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` and you're set.

---

## Prerequisites

**macOS:**

KubeStudio uses WebKit for its WebView, which ships with macOS. No extra dependencies needed — just **Rust 1.91.1+** and a reachable Kubernetes cluster.


**Debian / Ubuntu:**

Install the WebView and GTK development libraries:

```bash
sudo apt install -y libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev
```


**Fedora:**

Install the WebView and GTK development libraries:

```bash
sudo dnf install webkit2gtk4.1-devel gtk3-devel libappindicator-gtk3-devel
```


---

## Verify

```bash
cargo test --workspace
```

---

## Troubleshooting

- **Missing WebKit** — Install the WebView libraries for your platform (see the Prerequisites tab above).
- **Rust version too old** — Run `rustup update` to get the latest stable toolchain.
- **Kubeconfig not found** — Ensure `~/.kube/config` exists or set the `KUBECONFIG` env variable.
