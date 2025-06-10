/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import fs from 'fs/promises'
import path from 'path'
import prettier from 'prettier'
import globby from 'globby'
import chalk from 'chalk'
// eslint-disable-next-line import/no-unresolved
import pluginPhp from '@prettier/plugin-php'

/**
 * Programmatically format supported files using Prettier.
 * Only formats if a parser is available. Ignores unknown formats.
 */
export default async function runPrettierFormat(cwd = process.cwd()) {
    const patterns = [
        '**/*.js',
        '**/*.cjs',
        '**/*.mjs',
        '**/*.json',
        '**/*.css',
        '**/*.scss',
        '**/*.html',
        '**/*.md',
        '**/*.yml',
        '**/*.yaml',
        '**/*.php'
    ]

    const ignorePatterns = ['node_modules', 'dist', 'coverage']

    const filePaths = await globby(patterns, {
        cwd,
        absolute: true,
        gitignore: true,
        ignore: ignorePatterns
    })

    let formatted = 0
    let skipped = 0
    let failed = 0

    for (const file of filePaths) {
        try {
            const source = await fs.readFile(file, 'utf8')
            const options = await prettier.resolveConfig(file, {
                plugins: [pluginPhp],
                editorconfig: true
            })

            const info = await prettier.getFileInfo(file, {
                ignorePath: path.join(cwd, '.prettierignore'),
                plugins: [pluginPhp]
            })

            if (info.ignored || info.inferredParser == null) {
                skipped++
                // eslint-disable-next-line no-continue
                continue
            }

            const formattedContent = prettier.format(source, {
                ...options,
                filepath: file,
                plugins: [pluginPhp]
            })

            if (formattedContent !== source) {
                await fs.writeFile(file, formattedContent, 'utf8')
                console.log(chalk.green(`✔ formatted: ${path.relative(cwd, file)}`))
                formatted++
            } else {
                console.log(chalk.gray(`= unchanged: ${path.relative(cwd, file)}`))
            }
        } catch (err) {
            console.error(chalk.red(`✖ error in: ${path.relative(cwd, file)}`))
            console.error(err.message || err)
            failed++
        }
    }

    console.log()
    console.log(chalk.bold(`✅ Format complete.`))
    console.log(chalk.gray(`Formatted: ${formatted}, Skipped: ${skipped}, Errors: ${failed}`))

    if (failed > 0) process.exit(1)
}
