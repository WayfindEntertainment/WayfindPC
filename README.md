# Wayfind Package Controller

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![eslint](https://img.shields.io/badge/style-eslint-4B32C3.svg)
![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

**Wayfind Package Controller** (`wayfindpc`) is a fast, opinionated Node.js project initializer and task runner.

It sets up a default set of linting and formatting tools, manages config files, and provides built-in commands to keep your code clean — all from a single devDependency.

## ✨ Features

- Instant project setup with `npx wayfindpc`
- ESLint with [Airbnb Base](https://github.com/airbnb/javascript) + Prettier
- Prettier formatting with 4-space tabs, no semicolons
- Built-in `format` and `lint` commands
- VSCode support preconfigured
- Centralized config — **only one devDependency!**
- Safe file copying with `--force` override

## 📦 What It Does

When you run `wayfindpc`, it:

1. Prompts for a project name (or uses your existing one if run inside an existing Node project folder)
2. Adds/updates `"format"` and `"lint"` scripts in `package.json`
3. Installs `wayfindpc` as a **devDependency**
4. Adds stub config files pointing to shared settings:
   - `.eslintrc.js`
   - `prettier.config.js`
   - `.eslintignore`
   - `.prettierignore`
   - `.vscode/settings.json`
5. Ensures VSCode resolves ESLint plugins cleanly

## 🚀 Getting Started

### Create a new project (from an empty folder):
```bash
mkdir my-project
cd my-project
npx wayfindpc
```

### Add to an existing project:
```bash
cd existing-project
npx wayfindpc
```

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

Behind the scenes, these will use `wayfindpc` to run:

```bash
npx eslint . --fix && npx prettier --write .
npx eslint . && npx prettier --check .
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

This is safe. It only replaces stub config files, not your source code.

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

Your `.eslintrc.js`:

```js
module.exports = {
  extends: ['wayfindpc/eslint']
}
```

## 📋 Requirements

- **Node.js**: v18 or newer
- **npm**: v9 or newer recommended
- **VSCode** (optional): detects `eslint.nodePath` for plugin resolution

## 🧠 Philosophy

**wayfindpc** is intentionally opinionated.

It assumes you want:
- Consistent formatting and linting
- Fast setup
- No config file sprawl

If you prefer full customization or different linting stacks, this tool may not be for you. But if you want clean code with no fuss... welcome aboard!

## 📜 License

MIT © [Wayfind Entertainment](https://wayfindminecraft.com)
