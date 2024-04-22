"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const confirm_1 = __importDefault(require("@inquirer/confirm"));
async function accepted(message) {
    return await (0, confirm_1.default)({ message: message });
}
exports.default = accepted;
