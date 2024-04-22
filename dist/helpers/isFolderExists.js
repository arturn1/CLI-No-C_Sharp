"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExists = void 0;
const fs_1 = __importDefault(require("fs"));
function isExists(directoryPath) {
    try {
        if (fs_1.default.existsSync(directoryPath)) {
            const filesAndDirs = fs_1.default.readdirSync(directoryPath);
            console.log(filesAndDirs);
            return filesAndDirs.some(item => item === 'azure' && fs_1.default.lstatSync(`${directoryPath}/${item}`).isDirectory());
        }
        else {
            console.log(`O diretório ${directoryPath} não existe.`);
            return false;
        }
    }
    catch (error) {
        console.error(`Ocorreu um erro ao verificar a existência da pasta Azure: ${error}`);
        return false;
    }
}
exports.isExists = isExists;
