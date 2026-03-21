import { select } from "@clack/prompts";
import { OPTIONS, type timeStampMenu } from "../constants";
import { FUNCTION_MAP } from "../functionMaps";

export async function showTimeStampMenu() {
    const choice = await select({
        message: "TimeStamp Menu",
        options: [...OPTIONS.timeStampMenu]
    }) as timeStampMenu

    if (choice === 'back') {
        return;
    }
    else {
        await FUNCTION_MAP.timeStampMenu[choice]?.();
    }
}