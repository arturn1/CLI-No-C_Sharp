"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupControllerCommand = void 0;
const gen_controller_1 = require("../services/gen-controller");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const capitalize_first_letter_1 = require("../helpers/capitalize-first-letter");
const isValid_only_text_and_number_1 = require("../helpers/isValid-only-text-and-number");
const isExists_1 = require("../helpers/isExists");
const confirm_1 = __importDefault(require("../utils/confirm"));
function setupControllerCommand(parentCommand) {
    parentCommand.command('controller <nameController> [fields...]')
        .alias('c')
        .description('Generate an controller')
        .action(async (nameController, fields) => {
        if (!(0, isValid_only_text_and_number_1.isValidEntityName)(nameController))
            return console.log('O nome da entidade deve conter apenas letras e numeros.');
        const controllerData = {
            name: capitalize_first_letter_1.StringUtils.capitalizeFirstLetter(nameController),
            title: nameController,
            content: fields
        };
        const { name } = controllerData;
        const currentDirectory = process.cwd();
        let isExist = true;
        const projectPath = path_1.default.join(currentDirectory, "API", "Controllers");
        const fileName = name + "Controller.cs";
        if ((0, isExists_1.isExists)(projectPath, fileName))
            isExist = await (0, confirm_1.default)(`O Controller ${name} existe neste projeto, deseja substituir: `);
        if (!isExist)
            return;
        const commandsPath = path_1.default.join(currentDirectory, "Domain", 'Commands', `${name}Commands`);
        let content = false;
        if ((0, isExists_1.isExists)(commandsPath))
            content = await (0, confirm_1.default)(`Deseja utilizar os commands existente na pasta Commands/${name}`);
        if (content) {
            const handlerPath = path_1.default.join(currentDirectory, "Domain", "Handlers");
            const fileNameHandler = name + "Handler.cs";
            const isExistHandler = (0, isExists_1.isExists)(handlerPath, fileNameHandler);
            if (!isExistHandler) {
                console.log("Por favor, criar o Handler antes de proseguir com essa configuração.");
                return;
            }
            ;
            const filesAndDirs = fs_1.default.readdirSync(commandsPath);
            controllerData["content"] = filesAndDirs;
        }
        else {
            controllerData["content"] = [];
        }
        (0, gen_controller_1.genController)(controllerData);
    });
}
exports.setupControllerCommand = setupControllerCommand;
