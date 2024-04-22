"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupHandlerCommand = void 0;
const gen_handler_1 = require("../services/gen-handler");
const isValid_only_text_and_number_1 = require("../helpers/isValid-only-text-and-number");
const capitalize_first_letter_1 = require("../helpers/capitalize-first-letter");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const isExists_1 = require("../helpers/isExists");
const confirm_1 = __importDefault(require("../utils/confirm"));
function setupHandlerCommand(parentCommand) {
    parentCommand.command('repository <nameRepository>')
        .alias('h')
        .description('Generate an handler')
        .option('--noRepository', 'This command create handler in repository target')
        .action(async (nameHandler, options) => {
        if (!(0, isValid_only_text_and_number_1.isValidEntityName)(nameHandler))
            return console.log('O nome da repository deve conter apenas letras e numeros.');
        const { noRepository } = options;
        const handlerData = {
            name: capitalize_first_letter_1.StringUtils.capitalizeFirstLetter(nameHandler),
            title: nameHandler,
            repository: noRepository === undefined ? true : false
        };
        const { name } = handlerData;
        const currentDirectory = process.cwd();
        let isExist = true;
        const projectPath = path_1.default.join(currentDirectory, "Domain", "Handlers");
        const fileName = name + "Handler.cs";
        if ((0, isExists_1.isExists)(projectPath, fileName))
            isExist = await (0, confirm_1.default)(`O Handler ${name} existe neste projeto, deseja substituir: `);
        if (!isExist)
            return;
        const commandsPath = path_1.default.join(currentDirectory, "Domain", 'Commands', `${name}Commands`);
        let content = false;
        if ((0, isExists_1.isExists)(commandsPath))
            content = await (0, confirm_1.default)(`Deseja utilizar os commands existente na pasta Commands/${name}`);
        if (content) {
            const filesAndDirs = fs_1.default.readdirSync(commandsPath);
            handlerData["content"] = filesAndDirs;
        }
        else {
            handlerData["content"] = [];
        }
        (0, gen_handler_1.genHandler)(handlerData);
    });
}
exports.setupHandlerCommand = setupHandlerCommand;
