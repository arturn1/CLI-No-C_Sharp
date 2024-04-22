"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExists = void 0;
const fs_1 = __importDefault(require("fs"));
function isExists(directoryPath, target = null) {
    try {
        if (fs_1.default.existsSync(directoryPath)) {
            const filesAndDirs = fs_1.default.readdirSync(directoryPath);
            if (target)
                return filesAndDirs.includes(target);
            return !!fs_1.default.readdirSync(directoryPath);
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.error(`Ocorreu um erro ao verificar a existência da pasta Azure: ${error}`);
        return false;
    }
}
exports.isExists = isExists;
