"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEntityCommand = void 0;
const capitalize_first_letter_1 = require("../helpers/capitalize-first-letter");
const isValid_only_text_and_number_1 = require("../helpers/isValid-only-text-and-number");
const gen_entity_1 = require("../services/gen-entity");
const isExists_1 = require("../helpers/isExists");
const path_1 = __importDefault(require("path"));
const confirm_1 = __importDefault(require("../utils/confirm"));
function setupEntityCommand(parentCommand) {
    parentCommand.command('entity <nameEntity> [fields...]')
        .alias('e')
        .description('Generate an entity')
        .option('--postgres <postgreSQLFields>', 'Specify PostgreSQL fields for the entity')
        .option('--baseSkip', 'This command ignore Base Entity')
        .action(async (nameEntity, fields, options) => {
        if (!(0, isValid_only_text_and_number_1.isValidEntityName)(nameEntity))
            return console.log('O nome da entidade deve conter apenas letras e numeros.');
        if (!fields.length)
            return console.log('A entidade precisa ter pelo menos uma declaracao.');
        const currentDirectory = process.cwd();
        const fileName = capitalize_first_letter_1.StringUtils.capitalizeFirstLetter(nameEntity + "Entity.cs");
        const projectPath = path_1.default.join(currentDirectory, "Domain", "Entities");
        let isExist = true;
        if ((0, isExists_1.isExists)(projectPath, fileName))
            isExist = await (0, confirm_1.default)(`A entidade ${nameEntity} existe neste projeto, deseja substituir: `);
        if (!isExist)
            return;
        let postgres;
        if (options.postgres) {
            const [table, schema] = options.postgres.split(":");
            postgres = { table, schema };
        }
        const baseSkip = await (0, confirm_1.default)(`Deseja utilizar a BaseEntity: `);
        const entityData = {
            name: capitalize_first_letter_1.StringUtils.capitalizeFirstLetter(nameEntity),
            postgres: postgres,
            baseSkip: baseSkip,
            content: fields
        };
        (0, gen_entity_1.genEntity)(entityData);
    });
}
exports.setupEntityCommand = setupEntityCommand;
