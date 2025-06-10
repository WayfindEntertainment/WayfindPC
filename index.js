#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import chalk from 'chalk'
import { execa } from 'execa'
import { fileURLToPath } from 'url'

import runPrettierFormat from './lib/format'

const sourceRoot = path.dirname(fileURLToPath(import.meta.url))

const wayfindpcPkgVersion = JSON.parse(
    fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8')
).version

const configFiles = [
    '.eslintrc.json',
    '.eslintignore',
    '.prettierrc.json',
    '.prettierignore',
    '.gitattributes',
    '.vscode/settings.json'
]

async function main() {
    if (process.argv.includes('--version')) {
        console.log(`wayfindpc v${wayfindpcPkgVersion}`)
        process.exit(0)
    }

    if (process.argv[2] === 'format') {
        console.log(chalk.cyan('🔧 Formatting project with ESLint and Prettier...'))
        await runPrettierFormat()
        process.exit(0)
    }

    if (process.argv[2] === 'lint') {
        console.log(chalk.cyan('🔍 Checking project with ESLint and Prettier...'))
        try {
            await execa('npx', ['eslint', '.'], { stdio: 'inherit' })
            await execa('npx', ['prettier', '--check', '.'], { stdio: 'inherit' })
        } catch (err) {
            if (err.exitCode === 2 && /No files matching/.test(err.stderr || '')) {
                console.warn(chalk.yellow('⚠️ No matching files to format with ESLint.'))
            } else {
                console.error(chalk.red('❌ Formatting failed:'), err.message || err)
                process.exit(1)
            }
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
                chalk.yellow(`⚠️ Found existing package.json. Maintaining the current name.`)
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
        wayfindpc: `^${wayfindpcPkgVersion}`
    }

    await fs.writeJSON(pkgJsonPath, pkg, { spaces: 4 })
    await fs.ensureDir(path.join(cwd, '.vscode'))

    console.log(chalk.cyan('\nWriting fresh config files...'))

    const skipped = []
    const written = []

    // eslint-disable-next-line no-restricted-syntax
    for (const filename of configFiles) {
        const src = path.join(sourceRoot, filename)
        const dest = path.join(cwd, filename)
        const exists = fs.existsSync(dest)

        if (exists && !force) {
            skipped.push(filename)
            // eslint-disable-next-line no-continue
            continue
        }

        // eslint-disable-next-line no-await-in-loop
        await fs.copy(src, dest)
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

    console.log(`\n ${chalk.yellow('Tip:')}`)
    console.log(
        chalk.gray('If ESLint squiggles are not showing in VS Code, open the Command Palette') +
            chalk.gray(' (') +
            chalk.cyan('Ctrl+Shift+P') +
            chalk.gray(') and run ') +
            chalk.cyan('"ESLint: Restart ESLint Server".\n')
    )
}

main()
