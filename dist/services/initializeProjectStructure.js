"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeProjectStructure = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Mustache = require('mustache');
const readFile_1 = require("../helpers/readFile");
const capitalize_first_letter_1 = require("../helpers/capitalize-first-letter");
function initializeProjectStructure(nomeProject) {
    const currentDirectory = process.cwd();
    const projectPath = path_1.default.join(currentDirectory, nomeProject);
    const foldersToCreate = [
        'API/Properties',
        'API/Configurations',
        'API/Controllers',
        'API/Controllers/Contract',
        'API/Middleware',
        'Application/Dictionary',
        'Application/DTOs',
        'Application/DTOs/Request',
        'Application/DTOs/Response',
        'Application/Interfaces',
        'Application/Services',
        'Domain/Commands',
        'Domain/Commands/Contracts',
        'Domain/Entities',
        'Domain/Handlers',
        'Domain/Handlers/Contracts',
        'Domain/Helpers',
        'Domain/Repositories',
        'Domain/Repositories/Contracts',
        'Domain/Validation',
        'Infrastructure/Configuration',
        'Infrastructure/Data',
        'Infrastructure/Repositories',
        'Infrastructure/Repositories/Contracts',
        'Infrastructure/Data/Mappings',
        'IoC',
    ];
    try {
        const rootFolderPath = path_1.default.join(__dirname, '../../template/init');
        const template = (0, readFile_1.processDirectory)(rootFolderPath);
        fs_1.default.mkdirSync(projectPath);
        for (const folder of foldersToCreate) {
            fs_1.default.mkdirSync(`${projectPath}/${folder}`, { recursive: true });
        }
        template.forEach((elem) => {
            const data = {};
            const file = Mustache.render(elem.content, data);
            const fileName = elem.fileName == "Template.sln" ? `/${capitalize_first_letter_1.StringUtils.capitalizeFirstLetter(nomeProject)}.sln` : elem.target.split("/template/init")[1];
            fs_1.default.writeFileSync(projectPath + fileName, file);
        });
        console.log(`Projeto '${capitalize_first_letter_1.StringUtils.capitalizeFirstLetter(nomeProject)}' inicializado com sucesso.`);
    }
    catch (error) {
        console.error('Erro ao inicializar o projeto:', error);
    }
}
exports.initializeProjectStructure = initializeProjectStructure;
