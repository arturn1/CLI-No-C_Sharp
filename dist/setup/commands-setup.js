"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommands = void 0;
const commander_1 = require("commander");
const commands_1 = require("../commands");
function setupCommands(program) {
    program.name('nc');
    (0, commands_1.setupInitCommand)(program);
    (0, commands_1.setupInjectorBootStrapper)(program);
    (0, commands_1.setupScaffoldCommand)(program);
    const genCommand = program.command('g');
    (0, commands_1.setupEntityCommand)(genCommand);
    (0, commands_1.setupCommandCommand)(genCommand);
    (0, commands_1.setupRepositoryCommand)(genCommand);
    (0, commands_1.setupHandlerCommand)(genCommand);
    (0, commands_1.setupControllerCommand)(genCommand);
    const addCommand = new commander_1.Command('add');
    program.addCommand(addCommand);
    (0, commands_1.setupScheuleAdd)(addCommand);
    (0, commands_1.setupAzureAdd)(addCommand);
    (0, commands_1.setupIdentityAdd)(addCommand);
}
exports.setupCommands = setupCommands;
