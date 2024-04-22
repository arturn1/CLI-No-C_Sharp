"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupIdentityAdd = void 0;
const fs_1 = require("fs");
const gen_command_solution_1 = require("../services/gen-command-solution");
const update_itemGroup_1 = require("../services/update-itemGroup");
const add_identity_1 = require("../services/add-identity");
function setupIdentityAdd(parentCommand) {
    parentCommand.command('identity')
        .description('Add identity in project')
        .action(async () => {
        const currentDirectory = process.cwd();
        const files = await fs_1.promises.readdir(currentDirectory);
        if (files.includes("Identity"))
            return console.log("Identity already exist");
        await (0, add_identity_1.addIdentity)();
        (0, gen_command_solution_1.genCommandSolution)("Identity");
        (0, update_itemGroup_1.updateItemGroup)("API", [`<ProjectReference Include="..\\Identity\\Identity.csproj" />`]);
    });
}
exports.setupIdentityAdd = setupIdentityAdd;
