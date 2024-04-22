import { Command } from 'commander';
import { StringUtils } from '../helpers/capitalize-first-letter';
import { isValidEntityName } from '../helpers/isValid-only-text-and-number';

import IEntity, { Database } from '../interfaces/entity.interface';

import { genEntity } from '../services/gen-entity';
import { isExists } from '../helpers/isExists';

import path from 'path';

import accepted from '../utils/confirm';

export function setupEntityCommand(parentCommand: Command) {
    parentCommand.command('entity <nameEntity> [fields...]')
        .alias('e')
        .description('Generate an entity')
        .option('--postgres <postgreSQLFields>', 'Specify PostgreSQL fields for the entity')
        .option('--baseSkip', 'This command ignore Base Entity')
        .action(async (nameEntity, fields, options) => {
            if (!isValidEntityName(nameEntity)) return console.log('O nome da entidade deve conter apenas letras e numeros.');
            if (!fields.length) return console.log('A entidade precisa ter pelo menos uma declaracao.');

            const currentDirectory = process.cwd();
            const fileName = StringUtils.capitalizeFirstLetter(nameEntity + "Entity.cs");
            const projectPath = path.join(currentDirectory, "Domain", "Entities");

            let isExist = true;

            if (isExists(projectPath, fileName)) isExist = await accepted(`A entidade ${nameEntity} existe neste projeto, deseja substituir: `)

            if (!isExist) return;

            let postgres: Database | undefined;

            if (options.postgres) {
                const [table, schema] = options.postgres.split(":")
                postgres = { table, schema };
            }

            const baseSkip = await accepted(`Deseja utilizar a BaseEntity: `)

            const entityData: IEntity = {
                name: StringUtils.capitalizeFirstLetter(nameEntity),
                postgres: postgres,
                baseSkip: baseSkip,
                content: fields
            }

            genEntity(entityData);
        });
}
