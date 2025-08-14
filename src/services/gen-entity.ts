import Mustache from "mustache";

import path from "path";
import Entity from "../interfaces/entity.interface";


import { readFile } from "../helpers/readFile";

import fs from 'fs';

import { Structure } from "../helpers/structure";

export function genEntity(data: Entity) {

    try {
        const rootFolderPath: string = path.join(__dirname, '../../template/entity/Entity.cs');
        const template = readFile(rootFolderPath);

        const entity = new Structure(data["content"]);
        
        // Get required usings and check for collections
        const customUsings = entity.getRequiredUsings();
        const hasCollections = customUsings.some(using => using.includes('Collections.Generic'));
        
        // Remove duplicates from usings
        const uniqueUsings = [...new Set(customUsings)];
        
        // Generate collection initializers for constructor
        const initializeCollections: string[] = [];
        const entityFields = entity.getEntity();
        for (const field in entityFields) {
            const fieldType = entityFields[field];
            if (fieldType.includes('List<') || fieldType.includes('ICollection<') || fieldType.includes('HashSet<')) {
                const fieldName = field;
                const innerType = fieldType.match(/<(.+)>/)?.[1] || 'object';
                if (fieldType.startsWith('List<')) {
                    initializeCollections.push(`            ${fieldName} = new List<${innerType}>();`);
                } else if (fieldType.startsWith('ICollection<')) {
                    initializeCollections.push(`            ${fieldName} = new List<${innerType}>();`);
                } else if (fieldType.startsWith('HashSet<')) {
                    initializeCollections.push(`            ${fieldName} = new HashSet<${innerType}>();`);
                }
            }
        }

        const renderedTemplate = Mustache.render(template["content"], {
            name: data["name"] + "Entity",
            database: data["postgres"] ? `[Table("${data["postgres"]["table"]}", Schema = "${data["postgres"]["schema"]}")]` : null,
            structureConstructor: entity.structureConstructor(),
            structureEntityThis: entity.structureEntityThis(),
            structureEntityPublic: entity.structureEntityPublic(),
            baseSkip: data["baseSkip"],
            hasCollections: hasCollections,
            customUsings: uniqueUsings,
            initializeCollections: initializeCollections
        }, {}, {
            escape: (text) => text // Disable HTML escaping
        });

        const currentDirectory = process.cwd();
        const fileName = data["name"] + "Entity.cs"
        const projectPath = path.join(currentDirectory, "Core", "Entities", fileName);

        // Ensure directory exists
        const dir = path.dirname(projectPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        try {
            const fileExist = fs.existsSync(projectPath);
            fs.writeFileSync(projectPath, renderedTemplate);

            // Entity processada
        } catch (error: any) {
            console.error('❌ Invalid Local \n', error.message);
        }

    } catch (error) {
        console.error('❌ Error generating entity:', error);
    }
}