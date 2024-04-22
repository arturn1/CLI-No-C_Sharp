"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupScaffoldCommand = void 0;
const capitalize_first_letter_1 = require("../helpers/capitalize-first-letter");
const gen_entity_1 = require("../services/gen-entity");
const gen_command_1 = require("../services/gen-command");
const gen_handler_1 = require("../services/gen-handler");
const gen_repository_1 = require("../services/gen-repository");
const gen_controller_1 = require("../services/gen-controller");
const gen_commandInjectorBootStrapper_1 = require("../services/gen-commandInjectorBootStrapper");
const gen_command_applicationDbContext_1 = require("../services/gen-command-applicationDbContext");
const confirm_1 = __importDefault(require("../utils/confirm"));
function setupScaffoldCommand(program) {
    program
        .command('scaffold <nameScaffold> [fields...]')
        .alias('s')
        .description('Create Entity, Command, Handler, Repository in project')
        .option('--postgres <postgreSQLFields>', 'Specify PostgreSQL fields for the entity')
        .option('--baseSkip', 'This command ignore Base Entity')
        .option('--id', 'Generates the file with the type of management it will have')
        .option('--noRepository', 'This command create handler in repository target')
        .action(async (nameScaffold, fields, options) => {
        let postgres;
        const { noRepository, id } = options;
        if (options.postgres) {
            const [table, schema] = options.postgres.split(":");
            postgres = { table, schema };
        }
        const baseSkip = await (0, confirm_1.default)(`Deseja utilizar a BaseEntity na entity: `);
        const name = capitalize_first_letter_1.StringUtils.capitalizeFirstLetter(nameScaffold);
        const scaffoldData = {
            name: name,
            title: nameScaffold,
            postgres: postgres,
            baseSkip: baseSkip,
            repository: noRepository === undefined ? true : false,
            content: fields,
        };
        const commandData = {
            name: name,
            id: id,
            content: fields
        };
        (0, gen_entity_1.genEntity)(scaffoldData);
        (0, gen_command_1.genCommand)({ ...commandData, type: "Create" });
        (0, gen_command_1.genCommand)({ ...commandData, type: "Update", id: true });
        (0, gen_handler_1.genHandler)({ ...scaffoldData, content: [`Create${name}Command.cs`, `Update${name}Command.cs`] });
        (0, gen_repository_1.genRepository)(scaffoldData);
        (0, gen_controller_1.genController)({ ...scaffoldData, content: [`Create${name}Command.cs`, `Update${name}Command.cs`] });
        (0, gen_commandInjectorBootStrapper_1.genCommandInjectorBootStrapper)(scaffoldData);
        (0, gen_command_applicationDbContext_1.genCommandApplicationDbContext)(scaffoldData);
    });
}
exports.setupScaffoldCommand = setupScaffoldCommand;
