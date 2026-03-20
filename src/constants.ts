const mainMenu = [
    { value: 'addShow', label: '1. Add Show' },
    { value: 'editShow', label: '2. Edit Show' },
    { value: 'removeShow', label: '3. Remove Show' },
    { value: 'viewAllShows', label: '4. View All Shows' },
    { value: 'exit', label: '5. Exit' },
] as const

export const OPTIONS = {
    mainMenu
}

export type MainMenuChoice = typeof mainMenu[number]['value']