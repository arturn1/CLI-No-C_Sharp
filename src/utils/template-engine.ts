import Mustache from 'mustache';
import path from 'path';
import fs from 'fs';

export class TemplateError extends Error {
    constructor(message: string, public templatePath?: string) {
        super(message);
        this.name = 'TemplateError';
    }
}

export class FileManager {
    static readFile(filePath: string): string {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            throw new Error(`Failed to read file: ${filePath}`);
        }
    }
    
    static writeFile(filePath: string, content: string): void {
        try {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(filePath, content);
        } catch (error) {
            throw new Error(`Failed to write file: ${filePath}`);
        }
    }
    
    static fileExists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }
}

export class TemplateEngine {
    private static templateCache = new Map<string, string>();

    /**
     * Renders a template with given data
     */
    static render(templatePath: string, data: any): string {
        try {
            const template = this.getTemplate(templatePath);
            return Mustache.render(template, data);
        } catch (error) {
            if (error instanceof TemplateError) {
                throw error;
            }
            throw new TemplateError(`Failed to render template: ${templatePath}`, templatePath);
        }
    }

    /**
     * Gets template content (with caching)
     */
    private static getTemplate(templatePath: string): string {
        // Check cache first
        if (this.templateCache.has(templatePath)) {
            return this.templateCache.get(templatePath)!;
        }

        try {
            const fullPath = this.resolveTemplatePath(templatePath);
            const content = FileManager.readFile(fullPath);
            
            // Cache the template
            this.templateCache.set(templatePath, content);
            
            return content;
        } catch (error) {
            throw new TemplateError(`Template not found: ${templatePath}`, templatePath);
        }
    }

    /**
     * Resolves template path relative to template directory
     */
    private static resolveTemplatePath(templatePath: string): string {
        // If it's already an absolute path, use it
        if (path.isAbsolute(templatePath)) {
            return templatePath;
        }

        // Resolve relative to template directory
        const templateDir = path.join(__dirname, '../../template');
        return path.join(templateDir, templatePath);
    }

    /**
     * Clears template cache
     */
    static clearCache(): void {
        this.templateCache.clear();
    }

    /**
     * Preloads commonly used templates
     */
    static preloadTemplates(): void {
        const commonTemplates = [
            'entity/Entity.cs',
            'command/Command.cs',
            'handler/Handler.cs',
            'repositories/Repository.cs',
            'repositories/IRepository.cs',
            'controller/Controller.cs'
        ];

        commonTemplates.forEach(template => {
            try {
                this.getTemplate(template);
            } catch (error) {
                console.warn(`Failed to preload template: ${template}`);
            }
        });
    }

    /**
     * Validates template syntax
     */
    static validateTemplate(templatePath: string): boolean {
        try {
            const template = this.getTemplate(templatePath);
            // Basic validation - try to parse the template
            Mustache.parse(template);
            return true;
        } catch (error) {
            return false;
        }
    }
}
