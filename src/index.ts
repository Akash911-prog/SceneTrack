import { intro, outro, select } from "@clack/prompts";

import { OPTIONS, type MainMenuChoice } from './constants';
import { FUNCTION_MAP } from "./functionMaps";

intro("SceneTrack your personal watchlist!");

while (true) {

    const choice = await select({
        message: 'Main Menu',
        options: [...OPTIONS.mainMenu]
    }) as MainMenuChoice

    if (choice === 'exit') {
        break;
    }
    else {
        await FUNCTION_MAP.mainMenu[choice]?.()
    }

}

outro('Have a great Day')