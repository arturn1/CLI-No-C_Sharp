import Mustache from "mustache";

import path from "path";
import Handler from "../interfaces/handler.interface";

import fs from 'fs';

import { readFile } from "../helpers/readFile";


export function genHandler(data: Handler) {
    try {
        const rootFolderPath: string = path.join(__dirname, '../../template/handler/Handler.cs');
        const template = readFile(rootFolderPath);

        const currentDirectory = process.cwd();

        data["command"] = [];

        data["content"]!.map((elem: string, index: number) => data["command"]?.push({
            commandName: elem.replace(".cs", ""),
            isFirst: !(index == 0),
            isUpdateCommand: elem.includes("Update")
        }))

        const renderedTemplate = Mustache.render(template["content"], data);

        const fileName = data["name"] + "Handler.cs";
        const projectPath = path.join(currentDirectory, "Domain", "Handlers", fileName);

        try {
            const fileExist = fs.existsSync(projectPath);
            fs.writeFileSync(projectPath, renderedTemplate);

            if (fileExist) console.log(`Handler '${data["name"]}' Atualizado com sucesso.`);
            else console.log(`Handler '${data["name"]}' Criada com sucesso.`);
        } catch (error: any) {
            console.error('Invalid Local \n', error.message);
        }
    } catch (error) {
        console.error('Erro ao gerar a handler:', error);
    }
}