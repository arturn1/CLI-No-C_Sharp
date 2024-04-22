"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAzureAdd = void 0;
const fs_1 = require("fs");
const gen_command_solution_1 = require("../services/gen-command-solution");
const update_itemGroup_1 = require("../services/update-itemGroup");
const add_azure_1 = require("../services/add-azure");
function setupAzureAdd(parentCommand) {
    parentCommand.command('azure')
        .description('Add azure in project')
        .action(async () => {
        const currentDirectory = process.cwd();
        const files = await fs_1.promises.readdir(currentDirectory);
        if (files.includes("Azure"))
            return console.log("Azure already exist");
        await (0, add_azure_1.addAzure)();
        (0, gen_command_solution_1.genCommandSolution)("Azure");
        (0, update_itemGroup_1.updateItemGroup)("API", [`<ProjectReference Include="..\\Azure\\Azure.csproj" />`]);
    });
}
exports.setupAzureAdd = setupAzureAdd;
