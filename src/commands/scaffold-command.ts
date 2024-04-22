import { Command } from 'commander';

import { Database } from '../interfaces/entity.interface';
import { StringUtils } from '../helpers/capitalize-first-letter';

import ICommand from '../interfaces/command.interface';

import { genEntity } from '../services/gen-entity';
import { genCommand } from '../services/gen-command';
import { genHandler } from '../services/gen-handler';
import { genRepository } from '../services/gen-repository';
import { genController } from '../services/gen-controller';

import { genCommandInjectorBootStrapper } from '../services/gen-commandInjectorBootStrapper';
import { genCommandApplicationDbContext } from '../services/gen-command-applicationDbContext';

import accepted from '../utils/confirm';


export function setupScaffoldCommand(program: Command) {
    program
        .command('scaffold <nameScaffold> [fields...]')
        .alias('s')
        .description('Create Entity, Command, Handler, Repository in project')
        .option('--postgres <postgreSQLFields>', 'Specify PostgreSQL fields for the entity')
        .option('--baseSkip', 'This command ignore Base Entity')
        .option('--id', 'Generates the file with the type of management it will have')
        .option('--noRepository', 'This command create handler in repository target')
        .action(async (nameScaffold, fields, options) => {
            let postgres: Database | undefined;

            const { noRepository, id } = options;

            if (options.postgres) {
                const [table, schema] = options.postgres.split(":")
                postgres = { table, schema };
            }

            const baseSkip = await accepted(`Deseja utilizar a BaseEntity na entity: `)

            const name = StringUtils.capitalizeFirstLetter(nameScaffold);

            const scaffoldData = {
                name: name,
                title: nameScaffold,
                postgres: postgres,
                baseSkip: baseSkip,
                repository: noRepository === undefined ? true : false,
                content: fields,
            }

            const commandData: ICommand = {
                name: name,
                id: id,
                content: fields
            }

            genEntity(scaffoldData)

            genCommand({ ...commandData, type: "Create" });
            genCommand({ ...commandData, type: "Update", id: true });

            genHandler({ ...scaffoldData, content: [`Create${name}Command.cs`, `Update${name}Command.cs`] })

            genRepository(scaffoldData);

            genController({ ...scaffoldData, content: [`Create${name}Command.cs`, `Update${name}Command.cs`] });

            genCommandInjectorBootStrapper(scaffoldData);

            genCommandApplicationDbContext(scaffoldData);
        });
}