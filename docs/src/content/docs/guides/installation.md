---
title: Installation Guide
description: Learn how to install runy on your system using different methods.
---

This guide will walk you through the different ways to install runy on your system.

## Installation Methods

There are two primary ways to install runy:

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

## Verify Installation

After installation, verify that runy is working correctly:

```bash
runy --version
```

You should see the version number of runy printed to your terminal.

## Next Steps

Now that you have runy installed, you can start using it to run tasks in your projects. Check out our other guides to learn more about runy's features and capabilities.
