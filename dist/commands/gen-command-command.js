"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommandCommand = void 0;
const gen_command_1 = require("../services/gen-command");
const capitalize_first_letter_1 = require("../helpers/capitalize-first-letter");
const isValid_only_text_and_number_1 = require("../helpers/isValid-only-text-and-number");
const isExists_1 = require("../helpers/isExists");
const path_1 = __importDefault(require("path"));
const confirm_1 = __importDefault(require("../utils/confirm"));
function setupCommandCommand(parentCommand) {
    parentCommand.command('command <nameCommand> [fields...]')
        .alias('f')
        .description('Generate an Command')
        .option('--type <typeFields>', 'Generates the file with the type of management it will have')
        .option('--id', 'Generates the file with the type of management it will have')
        .action(async (nameCommand, fields, options) => {
        const command = capitalize_first_letter_1.StringUtils.capitalizeFirstLetter(nameCommand);
        if (!(0, isValid_only_text_and_number_1.isValidEntityName)(nameCommand))
            return console.log('O nome da command deve conter apenas letras e numeros.');
        if (!options.type)
            return console.log("Favor, informa o tipo da command");
        const type = capitalize_first_letter_1.StringUtils.capitalizeFirstLetter(options.type);
        const currentDirectory = process.cwd();
        const fileName = `${type}${command}Command.cs`;
        const projectPath = path_1.default.join(currentDirectory, "Domain", 'Commands', `${command}Commands`);
        let isExist = true;
        if ((0, isExists_1.isExists)(projectPath, fileName))
            isExist = await (0, confirm_1.default)(`A command ${command} existe neste projeto, deseja substituir: `);
        if (!isExist)
            return;
        const commandData = {
            name: command,
            type: type,
            id: options.id,
            content: fields
        };
        (0, gen_command_1.genCommand)(commandData);
    });
}
exports.setupCommandCommand = setupCommandCommand;
