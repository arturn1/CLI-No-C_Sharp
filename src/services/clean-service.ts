import fs from 'fs';
import path from 'path';
import { StringUtils } from '../helpers/capitalize-first-letter';

interface CleanResult {
    success: boolean;
    filesRemoved: string[];
    errors: string[];
}

export class CleanService {
    
    public static cleanEntity(entityName: string, force: boolean = false): CleanResult {
        const result: CleanResult = {
            success: true,
            filesRemoved: [],
            errors: []
        };

        const currentDirectory = process.cwd();
        const formattedName = StringUtils.capitalizeFirstLetter(entityName);
        
        // Lista de arquivos/diretórios que serão removidos
        const filesToRemove = [
            // Entity
            `Core/Entities/${formattedName}Entity.cs`,
            
            // Commands
            `Core/Commands/${formattedName}Commands/Create${formattedName}Command.cs`,
            `Core/Commands/${formattedName}Commands/Update${formattedName}Command.cs`,
            `Core/Commands/${formattedName}Commands`,
            
            // Handler
            `Application/Handlers/${formattedName}Handler.cs`,
            
            // Repository Interface
            `Core/Repositories/I${formattedName}Repository.cs`,
            
            // Repository Implementation
            `Infrastructure/Repositories/${formattedName}Repository.cs`,
            
            // Controller
            `API/Controllers/${formattedName}Controller.cs`
        ];

        
        if (!force) {
            filesToRemove.forEach(file => {
                const fullPath = path.join(currentDirectory, file);
                if (fs.existsSync(fullPath)) {
                    // Lista arquivo para remoção
                }
            });
            return result;
        }

        // Remover arquivos
        filesToRemove.forEach(file => {
            const fullPath = path.join(currentDirectory, file);
            
            try {
                if (fs.existsSync(fullPath)) {
                    const stats = fs.statSync(fullPath);
                    
                    if (stats.isDirectory()) {
                        // Verificar se o diretório está vazio antes de remover
                        const dirContents = fs.readdirSync(fullPath);
                        if (dirContents.length === 0) {
                            fs.rmdirSync(fullPath);
                            result.filesRemoved.push(file);
                            // Diretório removido
                        } else {
                            // Diretório não vazio, mantido
                        }
                    } else {
                        fs.unlinkSync(fullPath);
                        result.filesRemoved.push(file);
                        // Arquivo removido
                    }
                }
            } catch (error: any) {
                result.errors.push(`Erro ao remover ${file}: ${error.message}`);
                result.success = false;
            }
        });

        // Tentar limpar das configurações (ApplicationDbContext, InjectorBootStrapper)
        this.cleanFromConfigurations(formattedName, result);

        return result;
    }

    public static cleanAll(force: boolean = false): CleanResult {
        const result: CleanResult = {
            success: true,
            filesRemoved: [],
            errors: []
        };

        const currentDirectory = process.cwd();
        
        // Diretórios que serão limpos completamente
        const directoriesToClean = [
            'Core/Commands',
            'Application/Handlers',
            'Core/Entities',
            'Core/IRepositories',
            'Infrastructure/Repositories',
            'API/Controllers'
        ];

        
        if (!force) {
            directoriesToClean.forEach(dir => {
                // Lista diretório para limpeza
            });
            return result;
        }

        directoriesToClean.forEach(dir => {
            const fullPath = path.join(currentDirectory, dir);
            
            try {
                if (fs.existsSync(fullPath)) {
                    this.cleanDirectory(fullPath, dir, result);
                }
            } catch (error: any) {
                result.errors.push(`Erro ao limpar diretório ${dir}: ${error.message}`);
                result.success = false;
            }
        });

        return result;
    }

    private static cleanDirectory(dirPath: string, relativePath: string, result: CleanResult): void {
        const files = fs.readdirSync(dirPath);
        
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const relativeFilePath = path.join(relativePath, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                // Recursivamente limpar subdiretórios
                this.cleanDirectory(filePath, relativeFilePath, result);
                
                // Tentar remover diretório se estiver vazio
                try {
                    const dirContents = fs.readdirSync(filePath);
                    if (dirContents.length === 0) {
                        fs.rmdirSync(filePath);
                        result.filesRemoved.push(relativeFilePath);
                        // Diretório removido
                    }
                } catch (error: any) {
                    // Ignorar erros ao remover diretórios não vazios
                }
            } else {
                // Remover apenas arquivos gerados (não arquivos base como BaseEntity, etc.)
                if (this.isGeneratedFile(file)) {
                    try {
                        fs.unlinkSync(filePath);
                        result.filesRemoved.push(relativeFilePath);
                        // Arquivo removido
                    } catch (error: any) {
                        result.errors.push(`Erro ao remover ${relativeFilePath}: ${error.message}`);
                        result.success = false;
                    }
                }
            }
        });
    }

    private static isGeneratedFile(fileName: string): boolean {
        // Lista de arquivos que NÃO devem ser removidos (arquivos base do template)
        const protectedFiles = [
            'BaseEntity.cs',
            'ICommand.cs',
            'BaseController.cs',
            'RepositoryBase.cs',
            'ValidatableTypes.cs'
        ];

        return !protectedFiles.includes(fileName) && fileName.endsWith('.cs');
    }

    private static cleanFromConfigurations(entityName: string, result: CleanResult): void {
        const currentDirectory = process.cwd();
        
        // Tentar limpar do ApplicationDbContext
        try {
            const dbContextPath = path.join(currentDirectory, 'Infrastructure/Data/ApplicationDbContext.cs');
            if (fs.existsSync(dbContextPath)) {
                let content = fs.readFileSync(dbContextPath, 'utf8');
                const dbSetPattern = new RegExp(`\\s*public DbSet<${entityName}Entity> ${entityName} { get; set; }[\\r\\n]*`, 'g');
                
                if (dbSetPattern.test(content)) {
                    content = content.replace(dbSetPattern, '');
                    fs.writeFileSync(dbContextPath, content);
                    // DbSet removido do ApplicationDbContext
                }
            }
        } catch (error: any) {
            result.errors.push(`Erro ao limpar ApplicationDbContext: ${error.message}`);
        }

        // Tentar limpar do InjectorBootStrapper
        try {
            const injectorPath = path.join(currentDirectory, 'IoC/NativeInjectorBootStrapper.cs');
            if (fs.existsSync(injectorPath)) {
                let content = fs.readFileSync(injectorPath, 'utf8');
                const injectionPattern = new RegExp(`\\s*services\\.AddScoped<I${entityName}Repository, ${entityName}Repository>\\(\\);[\\r\\n]*`, 'g');
                
                if (injectionPattern.test(content)) {
                    content = content.replace(injectionPattern, '');
                    fs.writeFileSync(injectorPath, content);
                    // Injeção de dependência removida do InjectorBootStrapper
                }
            }
        } catch (error: any) {
            result.errors.push(`Erro ao limpar InjectorBootStrapper: ${error.message}`);
        }
    }

    public static listGeneratedFiles(entityName?: string): string[] {
        const currentDirectory = process.cwd();
        const generatedFiles: string[] = [];

        if (entityName) {
            const formattedName = StringUtils.capitalizeFirstLetter(entityName);
            
            const filesToCheck = [
                `Core/Entities/${formattedName}Entity.cs`,
                `Core/Commands/${formattedName}Commands/Create${formattedName}Command.cs`,
                `Core/Commands/${formattedName}Commands/Update${formattedName}Command.cs`,
                `Application/Handlers/${formattedName}Handler.cs`,
                `Core/IRepositories/I${formattedName}Repository.cs`,
                `Infrastructure/Repositories/${formattedName}Repository.cs`,
                `API/Controllers/${formattedName}Controller.cs`
            ];

            filesToCheck.forEach(file => {
                const fullPath = path.join(currentDirectory, file);
                if (fs.existsSync(fullPath)) {
                    generatedFiles.push(file);
                }
            });
        } else {
            // Listar todos os arquivos gerados
            const directoriesToScan = [
                'Core/Entities',
                'Core/Commands',
                'Application/Handlers',
                'Core/Repositories',
                'Infrastructure/Repositories',
                'API/Controllers'
            ];

            directoriesToScan.forEach(dir => {
                const fullPath = path.join(currentDirectory, dir);
                if (fs.existsSync(fullPath)) {
                    this.scanDirectoryForGeneratedFiles(fullPath, dir, generatedFiles);
                }
            });
        }

        return generatedFiles;
    }

    private static scanDirectoryForGeneratedFiles(dirPath: string, relativePath: string, generatedFiles: string[]): void {
        const files = fs.readdirSync(dirPath);
        
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const relativeFilePath = path.join(relativePath, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                this.scanDirectoryForGeneratedFiles(filePath, relativeFilePath, generatedFiles);
            } else if (this.isGeneratedFile(file)) {
                generatedFiles.push(relativeFilePath.replace(/\\/g, '/'));
            }
        });
    }
}
