"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupScheuleAdd = void 0;
const fs_1 = require("fs");
const gen_command_solution_1 = require("../services/gen-command-solution");
const update_itemGroup_1 = require("../services/update-itemGroup");
const add_schedule_1 = require("../services/add-schedule");
function setupScheuleAdd(parentCommand) {
    parentCommand.command('schedule')
        .description('Add scheudle in project')
        .action(async () => {
        const currentDirectory = process.cwd();
        const files = await fs_1.promises.readdir(currentDirectory);
        if (files.includes("Schedule"))
            return console.log("Schedule already exist");
        await (0, add_schedule_1.addSchedule)();
        (0, gen_command_solution_1.genCommandSolution)("Schedule");
        (0, update_itemGroup_1.updateItemGroup)("API", [`<ProjectReference Include="..\\Schedule\\Schedule.csproj" />`]);
    });
}
exports.setupScheuleAdd = setupScheuleAdd;
