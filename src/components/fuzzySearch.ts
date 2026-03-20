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
}

const MAX_VISIBLE = 6

export const fuzzySearch = createPrompt(<T>(
    config: FuzzySearchConfig<T>,
    done: (value: T) => void
) => {
    const theme = makeTheme(config.theme)
    const prefix = usePrefix({ status: 'idle', theme })
    const [query, setQuery] = useState('')
    const [cursor, setCursor] = useState(0)

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
        if (isEnterKey(key)) {
            const selected = visible[safeCursor]
            if (selected) {
                process.stdout.write('\x1B[?25h')
                done(selected.value)
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

    const listLines = visible.length === 0
        ? [`  ${theme.style.error('No results')}`]
        : visible.map((item, i) => {
            if (i === safeCursor) {
                return `  ${theme.style.highlight('❯ ' + item.label)}`
            }
            return `    ${item.label}`
        })

    return [searchLine, ...listLines].join('\n')
})