import { confirm, intro, outro, select } from "@clack/prompts";

import { OPTIONS, type MainMenuChoice } from './constants';
import { FUNCTION_MAP } from "./functionMaps";
import { fuzzySearch } from "./components/fuzzySearch";

// intro("SceneTrack your personal watchlist!");

while (true) {

    const choice = await fuzzySearch({
        message: 'Main Menu',
        items: [...OPTIONS.mainMenu]
    }) as MainMenuChoice

    if (choice === 'exit') {
        break;
    }
    else {
        await FUNCTION_MAP.mainMenu[choice]?.()
    }

}

outro('Have a great Day')