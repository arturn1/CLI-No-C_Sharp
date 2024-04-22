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


export function setupCommands(program: Command) {
    program.name('nc');
    setupInitCommand(program);
    setupInjectorBootStrapper(program);
    setupScaffoldCommand(program);

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