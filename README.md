# 🎬 scenetrack

A menu-driven CLI tool for managing your watchlist — track shows, log timestamps with notes, and search through your library with fuzzy find or filters.

---

## Features

- **Watchlist management** — add, edit, and delete shows with metadata like status, rating, genre, and episode progress
- **Timestamp logging** — log exactly where you left off in a show, with optional notes (e.g. "finished season 2", "taking a break")
- **Fuzzy search** — fast, interactive search across your shows using a custom prompt built on `@inquirer/core`
- **Filters** — filter your watchlist by status, type, and rating using a grouped multiselect menu
- **Pretty menus** — all interactions are driven by `@clack/prompts` for a clean terminal UI
- **Local SQLite database** — your data stays on your machine, powered by Drizzle ORM

---

## Installation

### Homebrew (macOS / Linux)

```bash
brew tap Akash911-prog/scenetrack
brew install scenetrack
```

### Windows (manual)

Download the latest `.zip` from the [releases page](https://github.com/Akash911-prog/scenetrack/releases), extract it, and add the binary to your PATH.

---

## Usage

Run the CLI:

```bash
scenetrack
```

You'll be presented with a menu to:

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
| [@inquirer/core](https://github.com/SBoudrias/Inquirer.js) | Custom fuzzy search prompt |
| [Fuse.js](https://fusejs.io) | Fuzzy search engine |
| [cli-table3](https://github.com/cli-table/cli-table3) | Table rendering in terminal |

---

## License

MIT