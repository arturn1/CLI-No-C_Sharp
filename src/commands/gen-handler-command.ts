import { Command } from 'commander';

import { genHandler } from '../services/gen-handler';

import { isValidEntityName } from '../helpers/isValid-only-text-and-number';

import { StringUtils } from '../helpers/capitalize-first-letter';

import path from 'path';
import fs from 'fs';

import Handler from '../interfaces/handler.interface';

import { isExists } from '../helpers/isExists';

import accepted from '../utils/confirm';


export function setupHandlerCommand(parentCommand: Command) {
    parentCommand.command('repository <nameRepository>')
        .alias('h')
        .description('Generate an handler')
        .option('--noRepository', 'This command create handler in repository target')
        .action(async (nameHandler, options) => {
            if (!isValidEntityName(nameHandler)) return console.log('O nome da repository deve conter apenas letras e numeros.');

            const { noRepository } = options;

            const handlerData: Handler = {
                name: StringUtils.capitalizeFirstLetter(nameHandler),
                title: nameHandler,
                repository: noRepository === undefined ? true : false
            }

            const { name } = handlerData;

            const currentDirectory = process.cwd();

            let isExist = true;

            const projectPath = path.join(currentDirectory, "Domain", "Handlers");
            const fileName = name + "Handler.cs";

            if (isExists(projectPath, fileName)) isExist = await accepted(`O Handler ${name} existe neste projeto, deseja substituir: `);

            if (!isExist) return;

            const commandsPath = path.join(currentDirectory, "Domain", 'Commands', `${name}Commands`);

            let content = false;
            if (isExists(commandsPath)) content = await accepted(`Deseja utilizar os commands existente na pasta Commands/${name}`);

            if (content) {
                const filesAndDirs = fs.readdirSync(commandsPath);

                handlerData["content"] = filesAndDirs
            } else {
                handlerData["content"] = []
            }

            genHandler(handlerData);
        });
}
