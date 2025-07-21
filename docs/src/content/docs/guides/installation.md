---
title: Installation Guide
description: Learn how to install runy on your system using different methods.
---

This guide will walk you through the different ways to install runy on your system.

## Installation Methods

There are three primary ways to install runy:

### 1. Install Script

The easiest way to install runy is using our installation script:

```bash
curl --proto '=https' --tlsv1.2 -sLSf https://sh.runy.dev | sh
```

This script will:
- Detect your operating system and architecture
- Download the appropriate binary for your system
- Install runy to your local bin directory
- Add runy to your PATH

### 2. Homebrew

If you're using macOS or Linux and prefer using Homebrew, you can install runy from our tap:

```bash
brew tap runy-dev/runy
brew install runy
```

### 3. Manual Binary Download

You can also download the pre-compiled binaries directly from our GitHub releases page:

1. Go to the [runy releases page](https://github.com/s-panferov/runy/releases)
2. Download the appropriate archive for your system:
   - `runy-x86_64-apple-darwin.tar.xz` - macOS (Intel)
   - `runy-aarch64-apple-darwin.tar.xz` - macOS (Apple Silicon)
   - `runy-x86_64-unknown-linux-gnu.tar.xz` - Linux (glibc)
   - `runy-x86_64-unknown-linux-musl.tar.xz` - Linux (musl)
3. Extract the archive and move the `runy` binary to a directory in your PATH

Example for macOS:

```bash
# Download and extract (replace with your architecture)
curl -L -o runy.tar.xz https://github.com/s-panferov/runy/releases/latest/download/runy-aarch64-apple-darwin.tar.xz
tar -xf runy.tar.xz

# Move to a directory in your PATH
sudo mv runy /usr/local/bin/
```

## Verify Installation

After installation, verify that runy is working correctly:

```bash
runy --version
```

You should see the version number of runy printed to your terminal.

## Next Steps

Now that you have runy installed, you can start using it to run tasks in your projects. Check out our other guides to learn more about runy's features and capabilities.
