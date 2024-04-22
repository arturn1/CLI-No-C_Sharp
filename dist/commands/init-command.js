"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupInitCommand = void 0;
const isExists_1 = require("../helpers/isExists");
const initialize_ProjectStructure_1 = require("../services/initialize-ProjectStructure");
function setupInitCommand(program) {
    program
        .command('new <nameProject>')
        .description('Initialize a new project')
        .action(async (nameProject) => {
        const currentDirectory = process.cwd();
        if ((0, isExists_1.isExists)(currentDirectory, nameProject))
            return console.log(`O projeto ${nameProject} já existe neste diretório.`);
        (0, initialize_ProjectStructure_1.initializeProjectStructure)(nameProject);
    });
}
exports.setupInitCommand = setupInitCommand;
