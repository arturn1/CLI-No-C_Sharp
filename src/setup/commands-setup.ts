import { Command } from 'commander';
import {
    setupInitCommand,
    setupInjectorBootStrapper,
    setupScaffoldCommand,

    setupEntityCommand,
    setupCommandCommand,
    setupRepositoryCommand,
    setupHandlerCommand,
    setupControllerCommand,

    setupScheuleAdd,
    setupAzureAdd,
    setupIdentityAdd,
} from '../commands';

import { setupCleanCommand } from '../commands/clean-command';
import * as packageJson from '../../package.json';


export function setupCommands(program: Command) {
    program.name('nc');
    program.version(packageJson.version, '-v, --version', 'output the current version');
    
    setupInitCommand(program);
    setupInjectorBootStrapper(program);
    setupScaffoldCommand(program);
    setupCleanCommand(program);

    const genCommand = program.command('g');
    setupEntityCommand(genCommand);
    setupCommandCommand(genCommand);
    setupRepositoryCommand(genCommand);
    setupHandlerCommand(genCommand);
    setupControllerCommand(genCommand);

    const addCommand = new Command('add');
    program.addCommand(addCommand);
    setupScheuleAdd(addCommand);
    setupAzureAdd(addCommand);
    setupIdentityAdd(addCommand);
}