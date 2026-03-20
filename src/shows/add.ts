import { cancel, group, log, select, text } from "@clack/prompts"
import { OPTIONS, type showTypes, type statusOptions } from "../constants"
import { db } from "../db/client"
import { shows } from "../db/schema"
import { startCase } from "lodash-es"

export async function addShow() {
    const result = await group(
        {
            title: () => text({
                message: 'Title of the show:',
                placeholder: 'Pursuit of Jade',
                validate(value) {
                    if (!value || value.length === 0) return 'Title is required'
                }
            }),

            type: () => select({
                message: 'Type:',
                options: [...OPTIONS.showTypes]
            }),

            status: () => select({
                message: 'Current status:',
                options: [...OPTIONS.statusOptions]
            }),

            genre: () => text({
                message: 'Genre:',
                placeholder: 'Drama, Thriller...',
            }),

            totalEpisodes: ({ results }) => {
                if (results.type === 'movie') return Promise.resolve(null)
                return text({
                    message: 'Total episodes:',
                    placeholder: 'Leave blank if unknown',
                    validate(value) {
                        if (value && isNaN(Number(value))) return 'Must be a number'
                    }
                })
            },

            watchedEpisodes: ({ results }) => {
                if (results.type === 'movie') return Promise.resolve(null)
                if (results.status === 'planning') return Promise.resolve(null)
                return text({
                    message: 'Episodes watched so far:',
                    defaultValue: '0',
                    validate(value) {
                        if (value && isNaN(Number(value))) return 'Must be a number'
                    }
                })
            },

            rating: ({ results }) => {
                if (results.status !== 'watched') return Promise.resolve(null)
                return text({
                    message: 'Rating (1-10):',
                    validate(value) {
                        if (!value) return undefined
                        const n = Number(value)
                        if (isNaN(n) || n < 1 || n > 10) return 'Must be a number between 1 and 10'
                    }
                })
            },

            notes: () => text({
                message: 'Notes:',
                placeholder: 'Optional...',
            }),
        },
        {
            onCancel: () => {
                cancel('Operation cancelled')
                process.exit(0)
            }
        }
    )

    await db.insert(shows).values({
        title: startCase(result.title) as string,
        type: result.type as showTypes,
        status: result.status as statusOptions,
        genre: result.genre as string || null,
        totalEpisodes: result.totalEpisodes ? Number(result.totalEpisodes) : null,
        watchedEpisodes: result.watchedEpisodes ? Number(result.watchedEpisodes) : 0,
        rating: result.rating ? Number(result.rating) : null,
        notes: result.notes as string || null,
    })

    log.success(`${result.title} added to your watchlist!`)
}