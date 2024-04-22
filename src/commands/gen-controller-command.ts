import { Command } from 'commander';

import { genController } from '../services/gen-controller';

import path from 'path';
import fs from 'fs';

import { StringUtils } from '../helpers/capitalize-first-letter';
import { isValidEntityName } from '../helpers/isValid-only-text-and-number';

import Generation from '../interfaces/controller.interface';
import { isExists } from '../helpers/isExists';
import accepted from '../utils/confirm';

export function setupControllerCommand(parentCommand: Command) {
    parentCommand.command('controller <nameController> [fields...]')
        .alias('c')
        .description('Generate an controller')
        .action(async (nameController, fields) => {
            if (!isValidEntityName(nameController)) return console.log('O nome da entidade deve conter apenas letras e numeros.');

            const controllerData: Generation = {
                name: StringUtils.capitalizeFirstLetter(nameController),
                title: nameController,
                content: fields
            }

            const { name } = controllerData;

            const currentDirectory = process.cwd();

            let isExist = true;

            const projectPath = path.join(currentDirectory, "API", "Controllers");
            const fileName = name + "Controller.cs";

            if (isExists(projectPath, fileName)) isExist = await accepted(`O Controller ${name} existe neste projeto, deseja substituir: `);

            if (!isExist) return;

            const commandsPath = path.join(currentDirectory, "Domain", 'Commands', `${name}Commands`);

            let content = false;
            if (isExists(commandsPath)) content = await accepted(`Deseja utilizar os commands existente na pasta Commands/${name}`);

            if (content) {
                const handlerPath = path.join(currentDirectory, "Domain", "Handlers");
                const fileNameHandler = name + "Handler.cs";
                const isExistHandler = isExists(handlerPath, fileNameHandler)

                if (!isExistHandler) {
                    console.log("Por favor, criar o Handler antes de proseguir com essa configuração.")

                    return;
                };

                const filesAndDirs = fs.readdirSync(commandsPath);

                controllerData["content"] = filesAndDirs
            } else {
                controllerData["content"] = []
            }

            genController(controllerData);
        });
}
