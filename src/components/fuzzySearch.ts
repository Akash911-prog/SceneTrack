// src/components/fuzzySearch.ts
import {
    createPrompt,
    useState,
    useKeypress,
    useMemo,
    usePrefix,
    makeTheme,
    isUpKey,
    isDownKey,
    isEnterKey,
    type Theme,
} from '@inquirer/core'
import type { PartialDeep } from '@inquirer/type'
import Fuse from 'fuse.js'

type Item<T> = {
    label: string
    value: T
}

type FuzzySearchConfig<T> = {
    message: string
    items: Item<T>[]
    theme?: PartialDeep<Theme>
    multiple?: boolean
}

const MAX_VISIBLE = 6

export const fuzzySearch = createPrompt(<T>(
    config: FuzzySearchConfig<T>,
    done: (value: T | T[]) => void
) => {
    const theme = makeTheme(config.theme)
    const prefix = usePrefix({ status: 'idle', theme })
    const [query, setQuery] = useState('')
    const [cursor, setCursor] = useState(0)
    const [selected, setSelected] = useState<T[]>([])

    const fuse = useMemo(
        () => new Fuse(config.items, { keys: ['label'], threshold: 0.4 }),
        [config.items]
    )

    const filtered = useMemo(() => {
        if (!query) return config.items
        return fuse.search(query).map(r => r.item)
    }, [query, fuse])

    const visible = filtered.slice(0, MAX_VISIBLE)
    const safeCursor = Math.min(cursor, Math.max(visible.length - 1, 0))

    useKeypress((key, rl) => {

        if (key.name === 'space' && config.multiple) {
            const item = visible[safeCursor];
            if (!item) return;
            const already = selected.includes(item.value);
            setSelected(already
                ? selected.filter(v => v !== item.value)
                : [...selected, item.value]
            )
        }

        if (isEnterKey(key)) {
            if (config.multiple) {
                process.stdout.write('\x1B[?25h')
                done(selected as any)
            } else {
                const item = visible[safeCursor]
                if (item) {
                    process.stdout.write('\x1B[?25h')
                    done(item.value)
                }
            }
            return
        }

        if (isUpKey(key)) {
            setCursor(Math.max(0, safeCursor - 1))
            return
        }

        if (isDownKey(key)) {
            setCursor(Math.min(visible.length - 1, safeCursor + 1))
            return
        }

        if (key.name === 'backspace') {
            setQuery(query.slice(0, -1))
            rl.clearLine(0)
            return
        }

        // use key.name as fallback for character
        const char = key.name?.length === 1 ? key.name : null
        if (char) {
            setQuery(query + char)
            rl.clearLine(0)
            setCursor(0)
        }
    })

    // move these inside useKeypress scope isn't possible, so handle cursor hide in render
    process.stdout.write('\x1B[?25l')

    const searchLine = `${prefix} ${theme.style.message(config.message, 'idle')} ${query}`

    const separator = `\x1b[2m│\x1b[0m` // dim vertical bar, same as clack

    const listLines = visible.length === 0
        ? [`${separator}  ${theme.style.error('No results')}`]
        : visible.map((item, i) => {
            const isCursor = i === safeCursor

            if (config.multiple) {
                const isSelected = selected.includes(item.value)
                const checkbox = isSelected ? '◼' : '◻'
                if (isCursor) {
                    return `${separator}  ${theme.style.highlight('❯ ' + checkbox + ' ' + item.label)}`
                }
                return `${separator}    ${checkbox} ${item.label}`
            }

            if (isCursor) {
                return `${separator}  ${theme.style.highlight('  ◈ ' + item.label)}`
            }
            return `${separator}    ◇ ${item.label}`
        })

    return [searchLine, ...listLines].join('\n')
})