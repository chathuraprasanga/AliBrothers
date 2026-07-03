# AliBrothers Tracker

AliBrothers production, sales, and stock tracker — an Electron desktop app for recording daily production, sales, and stock movements, with reporting for customers, sales, production, and stock.

## Tech Stack

- [Electron](https://www.electronjs.org/) + [electron-vite](https://electron-vite.org/) for the desktop shell and build tooling
- [React 19](https://react.dev/) + [React Router](https://reactrouter.com/) for the renderer UI
- [Mantine](https://mantine.dev/) for UI components, forms, dates, and notifications
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) for local, file-based data storage
- TypeScript across main, preload, and renderer processes

## Features

- **Dashboard** — at-a-glance overview of the business
- **Production Entry** — record daily production
- **Sales Entry** — record sales to customers
- **Stock View** — track current stock levels
- **Reports** — customer sales, sales, production, and stock reports

## Project Structure

```
src/
├── main/            # Electron main process
│   ├── db/           # SQLite schema migrations and repositories
│   └── ipc/          # IPC handlers (customer, production, sales, stock, reports)
├── preload/         # Preload scripts bridging main and renderer
└── renderer/        # React application
    └── src/
        ├── components/
        ├── hooks/
        ├── lib/
        ├── print/
        └── routes/   # Dashboard, ProductionEntry, SalesEntry, StockView, reports/
```

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` (see `.nvmrc`)

## Project Setup

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Type Checking, Linting, Formatting

```bash
npm run typecheck
npm run lint
npm run format
```

### Build

```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac
```
