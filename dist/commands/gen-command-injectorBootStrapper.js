"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupInjectorBootStrapper = void 0;
const capitalize_first_letter_1 = require("../helpers/capitalize-first-letter");
const gen_commandInjectorBootStrapper_1 = require("../services/gen-commandInjectorBootStrapper");
function setupInjectorBootStrapper(parentCommand) {
    parentCommand.command('injector <nameController>')
        .alias('i')
        .description('Generate an Injector Boot Strapper')
        .action((nameRepository, options) => {
        (0, gen_commandInjectorBootStrapper_1.genCommandInjectorBootStrapper)({
            name: capitalize_first_letter_1.StringUtils.capitalizeFirstLetter(nameRepository),
            title: nameRepository
        });
    });
}
exports.setupInjectorBootStrapper = setupInjectorBootStrapper;
