"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRepositoryCommand = void 0;
const gen_repository_1 = require("../services/gen-repository");
const capitalize_first_letter_1 = require("../helpers/capitalize-first-letter");
const isValid_only_text_and_number_1 = require("../helpers/isValid-only-text-and-number");
const isExists_1 = require("../helpers/isExists");
const confirm_1 = __importDefault(require("../utils/confirm"));
const path_1 = __importDefault(require("path"));
function setupRepositoryCommand(parentCommand) {
    parentCommand.command('repository <nameRepository>')
        .alias('r')
        .description('Generate an repository')
        .action(async (nameRepository) => {
        if (!(0, isValid_only_text_and_number_1.isValidEntityName)(nameRepository))
            return console.log('O nome da entidade deve conter apenas letras e numeros.');
        const repositoryData = {
            name: capitalize_first_letter_1.StringUtils.capitalizeFirstLetter(nameRepository)
        };
        const { name } = repositoryData;
        const currentDirectory = process.cwd();
        const fileName = name + "Repository.cs";
        const projectPath = path_1.default.join(currentDirectory, "Infrastructure", "Repositories");
        const entityPath = path_1.default.join(currentDirectory, "Domain", "Entities");
        if (!(0, isExists_1.isExists)(entityPath, name + "Entity.cs"))
            return console.log("Favor criar a entity primeiramente");
        let isExist = true;
        if ((0, isExists_1.isExists)(projectPath, fileName))
            isExist = await (0, confirm_1.default)(`A entidade ${name} existe neste projeto, deseja substituir: `);
        if (!isExist)
            return;
        (0, gen_repository_1.genRepository)(repositoryData);
    });
}
exports.setupRepositoryCommand = setupRepositoryCommand;
