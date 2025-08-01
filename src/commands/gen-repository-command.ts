import { Command } from 'commander';

import { genRepository } from '../services/gen-repository';

import { StringUtils } from '../helpers/capitalize-first-letter';
import { isValidEntityName } from '../helpers/isValid-only-text-and-number';
import { isExists } from '../helpers/isExists';

import accepted from '../utils/confirm';

import Repository from '../interfaces/repository.interface';

import path from 'path';


export function setupRepositoryCommand(parentCommand: Command) {
    parentCommand.command('repository <nameRepository>')
        .alias('r')
        .description('Generate an repository')
        .action(async (nameRepository) => {
            if (!isValidEntityName(nameRepository)) return;

            const repositoryData: Repository = {
                name: StringUtils.capitalizeFirstLetter(nameRepository)
            }

            const { name } = repositoryData;

            const currentDirectory = process.cwd();
            const fileName = name + "Repository.cs";
            const projectPath = path.join(currentDirectory, "Infrastructure", "Repositories");
            const entityPath = path.join(currentDirectory, "Domain", "Entities");

            if (!isExists(entityPath, name + "Entity.cs")) return;

            let isExist = true;

            if (isExists(projectPath, fileName)) isExist = await accepted(`A entidade ${name} existe neste projeto, deseja substituir: `);

            if (!isExist) return;

            genRepository(repositoryData);
        });
}
