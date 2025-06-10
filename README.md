# Wayfind Package Controller

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![eslint](https://img.shields.io/badge/style-eslint-4B32C3.svg)
![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

**Wayfind Package Controller** (`wayfindpc`) is a fast, opinionated Node.js project scaffolder for
initializing new projects, linting, and formatting.

It sets up a default set of linting and formatting tools, manages config files, and provides
built-in commands to keep your code clean — all from a single devDependency.

## ✨ Features

- Instant project setup with `npx wayfindpc`
- Linting with ESLint using the [Airbnb Base](https://github.com/airbnb/javascript)
- Formatting with Prettier
- Built-in `format` and `lint` commands
- VSCode support preconfigured
- No need to clutter your dev dependencies with all of the extra boilerplate
- **Only one devDependency needed: `wayfindpc`!**

## 📦 What It Does

When you run `wayfindpc`, it:

1. Prompts for a project name (or uses your existing one if run inside an existing Node project
   folder)
2. Adds/updates `"format"` and `"lint"` scripts in `package.json`
3. Installs `wayfindpc` as a **devDependency**
4. Adds root-level config files with preconfigured settings:
    - `.eslintrc.json`
    - `prettierrc.json`
    - `.eslintignore`
    - `.prettierignore`
5. Ensures VSCode resolves ESLint plugins cleanly by adding:
    - `.vscode/settings.json`

## 🚀 Getting Started

### Create a new project (from an empty folder):

```bash
mkdir my-project
cd my-project
npx wayfindpc
```

This will prompt you for a project name. Optionally, you can provide the project name at the same
time:

```bash
npx wayfindpc my-project-name
```

### Add to an existing project:

```bash
cd existing-project
npx wayfindpc
```

This will add the linting/formatting config files and insert a `lint` and `format` script into your
`package.json`. Note: if you already had these scripts, it will overwrite them.

### Overwrite existing config files:

```bash
npx wayfindpc --force
```

## 🛠 Usage

Once installed, run these commands:

```bash
npm run format  # Fixes code style with ESLint + Prettier
npm run lint    # Checks for issues without modifying files
```

You can check the installed version at any time:

```bash
npx wayfindpc --version
```

Behind the scenes, these will use `wayfindpc` to run:

```bash
npx eslint . --fix && npx prettier --write . # Linting
npx eslint . && npx prettier --check . # Formatting
```

## 🧨 What `--force` Does

By default, `wayfindpc` **never overwrites** config files.

If the following files exist, they will be skipped:

- `.eslintrc.js`
- `prettier.config.js`
- `.eslintignore`
- `.prettierignore`
- `.vscode/settings.json`

### Use `--force` if:

- You want to **reapply the latest default files**
- You edited or deleted one and want it restored
- You are **upgrading** to a newer version of `wayfindpc`

```bash
npx wayfindpc --force
```

This is safe. It only replaces the ESLint and Prettier config files and the VS Code settings file,
not your source code.

## 🔍 Example Output

Your `package.json` will include:

```json
"scripts": {
  "format": "wayfindpc format",
  "lint": "wayfindpc lint"
},
"devDependencies": {
  "wayfindpc": "^1.0.0"
}
```

You can customize the resulting settings files as needed, but they are designed to plug and play
with no further action required.

## 📋 Requirements

- **Node.js**: v18 or newer
- **npm**: v9 or newer recommended
- **VSCode** (optional): Assists you with visual feedback for linting errors

## 🧠 Philosophy

**wayfindpc** is intentionally opinionated.

It assumes you want:

- Consistent formatting and linting
- Fast setup
- No config file sprawl

This program does not handle any git configurations.

If you prefer full customization or different linting stacks, this tool may not be for you. But if
you want clean code with no fuss... welcome aboard!

## 📜 License

MIT © [Wayfind Entertainment LLC](https://wayfindminecraft.com)
