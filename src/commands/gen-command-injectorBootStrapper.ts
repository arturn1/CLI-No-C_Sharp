import { Command } from 'commander';

import { StringUtils } from '../helpers/capitalize-first-letter';
import { genCommandInjectorBootStrapper } from '../services/gen-commandInjectorBootStrapper';

export function setupInjectorBootStrapper(parentCommand: Command) {
    parentCommand.command('injector <nameController>')
        .alias('i')
        .description('Generate an Injector Boot Strapper')
        .action((nameRepository, options) => {

            genCommandInjectorBootStrapper({
                name: StringUtils.capitalizeFirstLetter(nameRepository),
                title: nameRepository
            });
        });
}
