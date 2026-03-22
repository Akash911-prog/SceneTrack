import { cancel, isCancel, select } from "@clack/prompts";
import { importShows } from "./import";
import { text, log } from "@clack/prompts";
import path from "path";
import { defaultImportPath } from "../constants";
import { exportShows } from "./export";


export async function importExport() {
    const choice = await select({
        message: "What do you want to perform?",
        options: [
            { value: 'importShows', label: 'Import (JSON)' },
            { value: 'exportShows', label: 'Export (JSON)' }
        ]
    })
    if (isCancel(choice)) {
        cancel("Operation Cancelled!");
        return;
    }
    if (choice === 'importShows') {
        const fullFilePath = await text({
            message: "File path/name to the json file (~/.scenetrack/import)",
            validate: (value) => {
                if (!value) return 'Filename is required'
                if (!value.trim().endsWith('.json')) return 'Filename must end with .json'
            },
        }) as string
        let partialPaths;
        if (fullFilePath.includes('\\'))
            partialPaths = fullFilePath.split('\\')
        else
            partialPaths = fullFilePath.split('/')
        const filename = partialPaths.at(-1) as string;
        let filePath;
        partialPaths.pop()
        if (partialPaths.length === 0)
            filePath = defaultImportPath;
        else
            filePath = path.join(...partialPaths);
        await importShows(filePath, filename);
    }
    else {
        let fullFilePath = await text({
            message: "File Path to Export to (optional)"
        }) as string
        if (isCancel(fullFilePath)) {
            log.warn("No input!")
        }
        if (fullFilePath.length !== 0) {
            fullFilePath = path.resolve(fullFilePath)
        }
        await exportShows(fullFilePath);
        return;
    }
}