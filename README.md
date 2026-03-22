<div align="center">

# 🎬 scenetrack

**A menu-driven CLI tool for managing your watchlist**

Track shows, log timestamps with notes, and search your library with fuzzy find or filters — all from your terminal, all stored locally.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-blue)]()
[![Built with Bun](https://img.shields.io/badge/runtime-Bun-black)](https://bun.sh)

</div>

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [Bug Reports & Feedback](#bug-reports--feedback)
- [License](#license)

---

## Features

- **Watchlist management** — add, edit, and delete shows with metadata like status, rating, genre, and episode progress
- **Timestamp logging** — log exactly where you left off in a show, with optional notes (e.g. "finished season 2", "taking a break")
- **Fuzzy search** — fast, interactive search across your shows`
- **Filters** — filter your watchlist by status, type, and rating using a grouped multiselect menu
- **Pretty menus** — all interactions are driven by `@clack/prompts` for a clean terminal UI
- **Local SQLite database** — your data stays on your machine, powered by Drizzle ORM
- **Import and Export with JSON** — you can export and import all watchlist and timestamps with a json file

---

## Installation

### macOS / Linux — Homebrew

```bash
brew tap Akash911-prog/scenetrack
brew install scenetrack
```

### Windows — Chocolatey

```bash
choco install scenetrack
```

### Windows - Scoop
```bash
scoop bucket add scenetrack https://github.com/Akash911-prog/scoop-scenetrack
scoop install scenetrack
```

### Manual (recommended for Windows)

Download the latest `.zip` or `.tar.gz` from the [Releases page](https://github.com/Akash911-prog/scenetrack/releases), extract it, and add the binary to your `PATH`.

---

## Usage

Start the CLI:

```bash
scenetrack
```

You'll be presented with an interactive menu to:

- Add a new show
- Edit an existing show
- Delete a show
- View your watchlist (with fuzzy search + filters)
- Log a timestamp on a show
- Edit or delete a timestamp

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Bun](https://bun.sh) | Runtime + compiler |
| [Drizzle ORM](https://orm.drizzle.team) | Database ORM |
| [SQLite](https://www.sqlite.org) | Local database |
| [@clack/prompts](https://github.com/natemoo-re/clack) | Terminal UI menus |
| [Fuse.js](https://fusejs.io) | Fuzzy search engine |
| [cli-table3](https://github.com/cli-table/cli-table3) | Table rendering in terminal |

---

## Contributing

Contributions are welcome and appreciated! Here's how to get involved:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'Add some feature'`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please make sure your changes are well-tested and follow the existing code style before submitting a PR.

---

## Bug Reports & Feedback

### Found a bug?

Please open an issue on the [GitHub Issues page](https://github.com/Akash911-prog/scenetrack/issues) and include:

- A clear description of the problem
- Steps to reproduce it
- Your OS and scenetrack version
- Any relevant error output or screenshots

Use the **Bug Report** label when opening your issue to help triage it faster.

### Have a suggestion or feature request?

Head over to the [GitHub Issues page](https://github.com/Akash911-prog/scenetrack/issues) and open a new issue with the **Enhancement** or **Feature Request** label. Describe what you'd like to see and why it would be useful — all ideas are welcome.

### 💬 General feedback

For general feedback, questions, or informal discussions, feel free to start a thread in [GitHub Discussions](https://github.com/Akash911-prog/scenetrack/discussions) (if enabled) or reach out via issues.

> Please check existing issues and discussions before opening a new one to avoid duplicates.

---

## License

This project is licensed under the [MIT License](./LICENSE).
