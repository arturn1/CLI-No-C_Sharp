import Mustache from "mustache";

import path from "path";
import fs from 'fs';

import Repository from "../interfaces/repository.interface";

import { readFile } from "../helpers/readFile";

export function genRepository(data: Repository) {
    try {
        const rootFolderPath: string = path.join(__dirname, '../../template/repositories/Repository.cs');
        const rootFolderPathInterface: string = path.join(__dirname, '../../template/repositories/IRepository.cs');
        const template = readFile(rootFolderPath);
        const templateInterface = readFile(rootFolderPathInterface);

        const renderedTemplate = Mustache.render(template["content"], data);
        const renderedTemplateInterface = Mustache.render(templateInterface["content"], data);

        const currentDirectory = process.cwd();
        const fileName = data["name"] + "Repository.cs";
        const projectPath = path.join(currentDirectory, "Infrastructure", "Repositories", fileName);
        const projectPathInterface = path.join(currentDirectory, "Core", "IRepositories", "I" + fileName);

        try {
            let fileExist = fs.existsSync(projectPath);
            fs.writeFileSync(projectPath, renderedTemplate);

            // Repository processado
        } catch (error: any) {
            console.error('Invalid Local \n', error.message);
        }

        try {
            let fileExist = fs.existsSync(projectPathInterface);
            fs.writeFileSync(projectPathInterface, renderedTemplateInterface);

            // Repository Interface processado
        } catch (error: any) {
            console.error('Invalid Local \n', error.message);
        }
    } catch (error) {
        console.error('Erro ao gerar a repository:', error);
    }
}
