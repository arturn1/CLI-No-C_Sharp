import * as fs from 'fs';
import * as path from 'path';

interface ProcessResult {
    path: string;
    target?: string;
    fileName?: string;
    content: any;
}

export function readFile(filePath: string): ProcessResult {
    const fileContent: string = fs.readFileSync(filePath, 'utf8');

    return {
        path: filePath,
        content: fileContent
    };
}

export function processFile(filePath: string): ProcessResult {
    const fileContent: string = fs.readFileSync(filePath, 'utf8');

    const relativePath: string = path.relative(path.join(__dirname, 'template'), filePath);

    const target: string = relativePath.replace(/\\/g, '/');
    const fileName = relativePath.replace(/\\/g, '/').split("/").at(-1);

    return {
        path: filePath,
        fileName: fileName,
        target: target,
        content: fileContent
    };
}

export function processDirectory(directoryPath: string): ProcessResult[] {
    const files: string[] = fs.readdirSync(directoryPath);
    const results: ProcessResult[] = [];

    files.forEach((file: string) => {
        const filePath: string = path.join(directoryPath, file);

        // Filtrar arquivos e diretórios de build do .NET
        if (file === 'obj' || file === 'bin' || 
            file.endsWith('.user') || 
            file.endsWith('.suo') || 
            file.includes('.vs')) {
            return; // Pular arquivos/diretórios de build
        }

        if (fs.statSync(filePath).isDirectory()) {
            results.push(...processDirectory(filePath));
        } else {
            // Filtrar arquivos específicos de build
            if (!file.includes('.cache') && 
                !file.includes('.AssemblyInfo') && 
                !file.includes('.GlobalUsings') && 
                !file.includes('.editorconfig') &&
                !file.includes('AssemblyAttributes')) {
                results.push(processFile(filePath));
            }
        }
    });

    return results;
}