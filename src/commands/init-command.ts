import { Command } from 'commander';

import { isExists } from '../helpers/isExists';

import { initializeProjectStructure } from '../services/initialize-ProjectStructure';

export function setupInitCommand(program: Command) {
    program
        .command('new <nameProject>')
        .description('Initialize a new project')
        .action(async (nameProject) => {
            const currentDirectory = process.cwd();
            if (isExists(currentDirectory, nameProject)) return console.log(`O projeto ${nameProject} já existe neste diretório.`);

            initializeProjectStructure(nameProject);
        });
}
