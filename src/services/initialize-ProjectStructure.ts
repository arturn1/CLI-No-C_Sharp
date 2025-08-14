import path from 'path';
import fs from 'fs';

const Mustache = require('mustache');

import { processDirectory } from '../helpers/readFile';
import { StringUtils } from '../helpers/capitalize-first-letter';

export function initializeProjectStructure(nomeProject: string) {
    const currentDirectory = process.cwd();
    const projectPath = path.join(currentDirectory, nomeProject);

    const foldersToCreate = [
        'API/Properties',
        'API/Configurations',
        'API/Controllers',
        'API/Controllers/Contract',
        'API/Middleware',

        'Application/Dictionary',
        'Application/DTOs',
        'Application/DTOs/Request',
        'Application/DTOs/Response',
        'Application/Interfaces',
        'Application/Services',
        'Application/Handlers',
        'Application/Handlers/Contracts',

        'Core/Commands',
        'Core/Commands/Contracts',
        'Core/Entities',
        'Core/Helpers',
        'Core/IRepositories',
        'Core/IRepositories/Contracts',
        'Core/Validation',

        'Infrastructure/Configuration',
        'Infrastructure/Data',
        'Infrastructure/Repositories',
        'Infrastructure/Repositories/Contracts',
        'Infrastructure/Data/Mappings',

        'IoC',
    ];

    try {
        const rootFolderPath: string = path.join(__dirname, '../../template/init');
        const template = processDirectory(rootFolderPath);

        fs.mkdirSync(projectPath);

        for (const folder of foldersToCreate) {
            fs.mkdirSync(`${projectPath}/${folder}`, { recursive: true });
        }

        template.forEach((elem: any) => {
            const data = {}

            const file = Mustache.render(elem.content, data);

            const fileName = elem.fileName == "Template.sln" ? `/${StringUtils.capitalizeFirstLetter(nomeProject)}.sln` : elem.target.split("/template/init")[1];
            
            // Verificar se o diretório de destino existe, senão criar
            const destinationPath = projectPath + fileName;
            const destinationDir = path.dirname(destinationPath);
            
            try {
                if (!fs.existsSync(destinationDir)) {
                    fs.mkdirSync(destinationDir, { recursive: true });
                }
                
                fs.writeFileSync(destinationPath, file);
            } catch (error) {
                console.warn(`Aviso: Não foi possível criar o arquivo ${fileName}:`, error);
                // Continua o processo sem parar
            }
        })

        // Projeto inicializado
    } catch (error) {
        console.error('Erro ao inicializar o projeto:', error);
    }
}
