import Mustache from "mustache";

import path from "path";
import Controller from "../interfaces/controller.interface";

import { readFile } from "../helpers/readFile";

import fs from 'fs';


export function genController(data: Controller) {
    try {
        const rootFolderPath: string = path.join(__dirname, '../../template/controller/Controller.cs');
        const template = readFile(rootFolderPath);

        const currentDirectory = process.cwd();

        data["command"] = [];

        data["content"]!.map((elem: string) => data["command"]?.push({
            commandName: elem.replace(".cs", ""),
            isUpdateCommand: elem.includes("Update")
        }))

        // Check if needs collections using (placeholder for now, could be enhanced later)
        const hasCollections = false; // Can be enhanced to check command types

        const templateData = {
            ...data,
            hasCollections: hasCollections
        };

        const renderedTemplate = Mustache.render(template["content"], templateData);

        const fileName = data["name"] + "Controller.cs";
        const projectPath = path.join(currentDirectory, "API", "Controllers", fileName);


        try {
            const fileExist = fs.existsSync(projectPath);
            fs.writeFileSync(projectPath, renderedTemplate);

            // Controller processado
        } catch (error: any) {
            console.error('Invalid Local \n', error.message);
        }
    } catch (error) {
        console.error('Erro ao gerar a controller:', error);
    }
}