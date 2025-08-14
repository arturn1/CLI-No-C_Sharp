import Mustache from "mustache";

import path from "path";
import Command from "../interfaces/command.interface";

import fs from 'fs';

import { readFile } from "../helpers/readFile";

import { Structure } from "../helpers/structure";


export function genCommand(data: Command) {

    try {
        const rootFolderPath: string = path.join(__dirname, '../../template/command/Command.cs');
        const template = readFile(rootFolderPath);

        const entity = new Structure(data["content"]);
        
        // Get required usings and check for collections/entities
        const customUsings = entity.getRequiredUsings();
        const hasCollections = customUsings.some(using => using.includes('Collections.Generic'));
        const hasEntities = customUsings.some(using => using.includes('Core.Entities'));

        const renderedTemplate = Mustache.render(template["content"], {
            name: data["type"] + data["name"] + "Command",
            id: data["id"],
            structureConstructor: entity.structureConstructor(),
            structureEntityThis: "\n" + entity.structureEntityThis(),
            structureEntityPublic: "\n" + entity.structureEntityPublic(),
            hasCollections: hasCollections,
            hasEntities: hasEntities
        }, {}, {
            escape: (text) => text  // Desabilitar escape HTML
        })

        const currentDirectory = process.cwd();
        const fileName = data["type"] + data["name"] + "Command.cs"
        const encapsulation = data["name"] + "Commands"
        const pathCommand = path.join(currentDirectory, "Core", "Commands")

        fs.mkdirSync(`${currentDirectory}/Core/Commands/${encapsulation}`, { recursive: true });

        const projectPath = path.join(pathCommand, encapsulation, fileName);

        try {
            const fileExist = fs.existsSync(projectPath);
            fs.writeFileSync(projectPath, renderedTemplate);

            // Command processado
        } catch (error: any) {
            console.error('Invalid Local \n', error.message);
        }
    }
    catch (error) {
        console.error('Erro ao gerar a command:', error);
    }
}