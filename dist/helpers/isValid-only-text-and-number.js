"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEntityName = void 0;
function isValidEntityName(name) {
    return /^[a-zA-Z0-9]+$/.test(name);
}
exports.isValidEntityName = isValidEntityName;
