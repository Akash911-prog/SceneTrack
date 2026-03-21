// src/components/fuzzySearch.ts
import { Prompt, isCancel } from '@clack/core'
import type { Key } from 'readline'
import Fuse from 'fuse.js'

type Item<T> = {
    label: string
    value: T
}

type FuzzySearchConfig<T> = {
    message: string
    items: Item<T>[]
    multiple?: boolean
}

type KeypressEvent = {
    name: string
    ctrl: boolean
    meta: boolean
    shift: boolean
    sequence: string
}

const MAX_VISIBLE = 6
const S = {
    dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
    bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
    cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
    red: (s: string) => `\x1b[31m${s}\x1b[0m`,
    highlight: (s: string) => `\x1b[36m\x1b[1m${s}\x1b[0m`,
}
const BAR = S.dim('│')

class FuzzySearchPrompt<T> extends Prompt<T | T[]> {
    private message: string
    private items: Item<T>[]
    private multiple: boolean
    private query: string = ''
    private cursor: number = 0
    private selected: Set<T> = new Set()
    private fuse: Fuse<Item<T>>

    constructor(config: FuzzySearchConfig<T>) {
        super({
            // @clack/core uses `this.value` for tracking; we manage state manually
            // so disable the built-in line tracking
            render() {
                return (this as unknown as FuzzySearchPrompt<T>)._buildFrame()
            },
        }, /* trackValue= */ false)

        this.message = config.message
        this.items = config.items
        this.multiple = config.multiple ?? false
        this.fuse = new Fuse(config.items, { keys: ['label'], threshold: 0.4 })

        this.on('key', (key: string | undefined, info: Key) => this._handleKey(info))
    }

    private get filtered(): Item<T>[] {
        if (!this.query) return this.items
        return this.fuse.search(this.query).map(r => r.item)
    }

    private get visible(): Item<T>[] {
        return this.filtered.slice(0, MAX_VISIBLE)
    }

    private get safeCursor(): number {
        return Math.min(this.cursor, Math.max(this.visible.length - 1, 0))
    }

    private _handleKey(key: Key): void {
        const visible = this.visible
        const cursor = this.safeCursor

        switch (key.name) {
            case 'up':
                this.cursor = Math.max(0, cursor - 1)
                break

            case 'down':
                this.cursor = Math.min(visible.length - 1, cursor + 1)
                break

            case 'space':
                if (this.multiple) {
                    const item = visible[cursor]
                    if (!item) break
                    if (this.selected.has(item.value)) {
                        this.selected.delete(item.value)
                    } else {
                        this.selected.add(item.value)
                    }
                }
                break

            case 'enter':
                if (this.multiple) {
                    this.value = [...this.selected] as any
                } else {
                    const item = visible[cursor]
                    if (!item) return
                    this.value = item.value as any
                }
                this.state = 'submit'
                this.close()
                break

            case 'backspace':
                this.query = this.query.slice(0, -1)
                this.cursor = 0
                break

            default: {
                const char = key.name?.length === 1 ? key.name : null
                if (char) {
                    this.query += char
                    this.cursor = 0
                }
            }
        }
    }

    private _buildFrame(): string {
        const visible = this.visible
        const cursor = this.safeCursor

        const searchLine = `${BAR}\n${BAR}  ${S.bold(this.message)} ${S.cyan(this.query)}▌`

        const listLines = visible.length === 0
            ? [`${BAR}  ${S.red('No results')}`]
            : visible.map((item, i) => {
                const isCursor = i === cursor

                if (this.multiple) {
                    const isChecked = this.selected.has(item.value)
                    const box = isChecked ? S.cyan('◼') : S.dim('◻')
                    const label = isCursor ? S.highlight(`❯ ${item.label}`) : S.dim(`  ${item.label}`)
                    return `${BAR}  ${box} ${label}`
                }

                if (isCursor) {
                    return `${BAR}  ${S.highlight(`◈ ${item.label}`)}`
                }
                return `${BAR}  ${S.dim(`◇ ${item.label}`)}`
            })

        return [searchLine, ...listLines, BAR].join('\n')
    }
}

export async function fuzzySearch<T>(config: FuzzySearchConfig<T>): Promise<T | T[] | symbol> {
    const prompt = new FuzzySearchPrompt<T>(config)
    const result = await prompt.prompt()
    if (result === undefined) throw new Error('fuzzySearch closed without a value')
    console.log(result);
    return result
}