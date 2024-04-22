import { Command } from 'commander';

import { genCommand } from '../services/gen-command';

import ICommand from '../interfaces/command.interface';

import { StringUtils } from '../helpers/capitalize-first-letter';
import { isValidEntityName } from '../helpers/isValid-only-text-and-number';
import { isExists } from '../helpers/isExists';

import path from 'path';

import accepted from '../utils/confirm';

export function setupCommandCommand(parentCommand: Command) {
    parentCommand.command('command <nameCommand> [fields...]')
        .alias('f')
        .description('Generate an Command')
        .option('--type <typeFields>', 'Generates the file with the type of management it will have')
        .option('--id', 'Generates the file with the type of management it will have')
        .action(async (nameCommand, fields, options) => {
            const command = StringUtils.capitalizeFirstLetter(nameCommand)
            if (!isValidEntityName(nameCommand)) return console.log('O nome da command deve conter apenas letras e numeros.');

            if (!options.type) return console.log("Favor, informa o tipo da command");
            const type = StringUtils.capitalizeFirstLetter(options.type)

            const currentDirectory = process.cwd();
            const fileName = `${type}${command}Command.cs`;
            const projectPath = path.join(currentDirectory, "Domain", 'Commands', `${command}Commands`);

            let isExist = true;

            if (isExists(projectPath, fileName)) isExist = await accepted(`A command ${command} existe neste projeto, deseja substituir: `)

            if (!isExist) return;

            const commandData: ICommand = {
                name: command,
                type: type,
                id: options.id,
                content: fields
            }

            genCommand(commandData);
        });
}