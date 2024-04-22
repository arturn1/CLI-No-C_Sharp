"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genHandler = void 0;
const mustache_1 = __importDefault(require("mustache"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const readFile_1 = require("../helpers/readFile");
function genHandler(data) {
    try {
        const rootFolderPath = path_1.default.join(__dirname, '../../template/handler/Handler.cs');
        const template = (0, readFile_1.readFile)(rootFolderPath);
        const currentDirectory = process.cwd();
        data["command"] = [];
        data["content"].map((elem, index) => data["command"]?.push({
            commandName: elem.replace(".cs", ""),
            isFirst: !(index == 0),
            isUpdateCommand: elem.includes("Update")
        }));
        const renderedTemplate = mustache_1.default.render(template["content"], data);
        const fileName = data["name"] + "Handler.cs";
        const projectPath = path_1.default.join(currentDirectory, "Domain", "Handlers", fileName);
        try {
            const fileExist = fs_1.default.existsSync(projectPath);
            fs_1.default.writeFileSync(projectPath, renderedTemplate);
            if (fileExist)
                console.log(`Handler '${data["name"]}' Atualizado com sucesso.`);
            else
                console.log(`Handler '${data["name"]}' Criada com sucesso.`);
        }
        catch (error) {
            console.error('Invalid Local \n', error.message);
        }
    }
    catch (error) {
        console.error('Erro ao gerar a handler:', error);
    }
}
exports.genHandler = genHandler;
