#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import chalk from 'chalk'
import { execa } from 'execa'

async function main() {
    if (process.argv[2] === 'format') {
        console.log(chalk.cyan('🔧 Formatting project with ESLint and Prettier...'))
        try {
            await execa('npx', ['eslint', '.', '--fix'], { stdio: 'inherit' })
            await execa('npx', ['prettier', '--write', '.'], { stdio: 'inherit' })
        } catch (err) {
            console.error(chalk.red('❌ Formatting failed:'), err.message || err)
            process.exit(1)
        }
        process.exit(0)
    }

    if (process.argv[2] === 'lint') {
        console.log(chalk.cyan('🔍 Checking project with ESLint and Prettier...'))
        try {
            await execa('npx', ['eslint', '.'], { stdio: 'inherit' })
            await execa('npx', ['prettier', '--check', '.'], { stdio: 'inherit' })
        } catch (err) {
            console.error(chalk.red('❌ Lint check failed:'), err.message || err)
            process.exit(1)
        }
        process.exit(0)
    }

    const rawArgs = process.argv.slice(2)
    const force = rawArgs.includes('--force')
    const nameArg = rawArgs.find((arg) => !arg.startsWith('--'))

    const cwd = process.cwd()
    const pkgJsonPath = path.join(cwd, 'package.json')
    const hasPkg = fs.existsSync(pkgJsonPath)

    let pkgName = nameArg
    let pkg = {}

    if (hasPkg) {
        if (pkgName) {
            console.log(
                chalk.yellow(`⚠️ Found existing package.json. Using package name "${pkgName}".`)
            )
        }

        pkg = await fs.readJSON(pkgJsonPath)
        pkgName = pkg.name || path.basename(cwd)
    } else {
        if (!pkgName) {
            const response = await prompts([
                {
                    type: 'text',
                    name: 'pkgName',
                    message: 'Package name:',
                    initial: 'my-project',
                    validate: (name) => /^[a-zA-Z0-9-_]+$/.test(name) || 'Invalid package name'
                }
            ])
            pkgName = response.pkgName
            if (!pkgName) {
                console.error(chalk.red('❌ No package name provided.'))
                process.exit(1)
            }
        }

        pkg.name = pkgName
        pkg.version = '1.0.0'
        pkg.type = 'module'
        pkg.scripts = {}
        pkg.devDependencies = {}
        console.log(chalk.cyan(`Creating new package.json as "${pkgName}"`))
    }

    if (pkg.scripts?.format && pkg.scripts.format !== 'wayfindpc format') {
        console.log(
            chalk.yellow(`⚠️ Overwriting existing "format" script: "${pkg.scripts.format}"`)
        )
    }

    if (pkg.scripts?.format && pkg.scripts.lint !== 'wayfindpc lint') {
        console.log(chalk.yellow(`⚠️ Overwriting existing "lint" script: "${pkg.scripts.lint}"`))
    }

    pkg.scripts = pkg.scripts || {}
    pkg.scripts.format = 'wayfindpc format'
    pkg.scripts.lint = 'wayfindpc lint'

    pkg.devDependencies = {
        ...pkg.devDependencies,
        wayfindpc: '^1.0.0'
    }

    pkg.eslintConfig = {
        extends: ['wayfindpc/config/eslint.cjs']
    }

    pkg.prettier = 'wayfindpc/config/prettier.cjs'

    await fs.writeJSON(pkgJsonPath, pkg, { spaces: 4 })
    await fs.ensureDir(path.join(cwd, '.vscode'))

    const filesToCreate = {
        '.eslintignore': 'node_modules\ndist\ndocs',
        '.prettierignore': 'dist\nnode_modules\n*.md',
        '.vscode/settings.json': JSON.stringify(
            {
                'editor.defaultFormatter': 'esbenp.prettier-vscode',
                'editor.codeActionsOnSave': {
                    'source.fixAll': 'never'
                },
                'editor.formatOnSave': false,
                'eslint.validate': ['javascript'],
                'eslint.nodePath': './node_modules/wayfindpc/node_modules'
            },
            null,
            4
        )
    }

    console.log(chalk.cyan('\nWriting config files...'))

    const skipped = []
    const written = []

    // eslint-disable-next-line no-restricted-syntax
    for (const [filename, content] of Object.entries(filesToCreate)) {
        const filepath = path.join(cwd, filename)
        const exists = fs.existsSync(filepath)
        if (exists && !force) {
            skipped.push(filename)
            // eslint-disable-next-line no-continue
            continue
        }

        // eslint-disable-next-line no-await-in-loop
        await fs.writeFile(filepath, content)
        written.push(filename)
    }

    if (written.length > 0) {
        console.log(chalk.green(`✅ Created: ${written.join(', ')}`))
    }

    if (skipped.length > 0) {
        console.log(chalk.yellow(`⚠️ Skipped: ${skipped.join(', ')}`))
        console.log(chalk.gray('   Use --force to overwrite existing files.'))
    }

    console.log(chalk.yellow('\nInstalling dependencies...\n'))

    try {
        await execa('npm', ['install'], { cwd, stdio: 'inherit' })
    } catch (err) {
        console.error(
            chalk.red('❌ Failed to install dependencies.'),
            chalk.gray('Try running `npm install` manually.')
        )
        process.exit(1)
    }

    console.log(chalk.greenBright('\n🎉 Project setup complete!'))
    console.log(
        chalk.gray('Run ') + chalk.cyan('npm run format') + chalk.gray(' to format your code.')
    )
    console.log(
        chalk.gray('Run ') + chalk.cyan('npm run lint') + chalk.gray(' to lint your code.\n')
    )
}

main()
