export class ValidationError extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export class ValidationSystem {
    validateProjectName(name: string): ValidationResult {
        const errors: string[] = [];

        if (!name || typeof name !== 'string') {
            errors.push('Nome do projeto é obrigatório');
        } else {
            if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
                errors.push('Nome do projeto deve conter apenas letras, números, _ e -');
            }
            if (name.length < 2) {
                errors.push('Nome do projeto deve ter pelo menos 2 caracteres');
            }
            if (name.length > 50) {
                errors.push('Nome do projeto deve ter menos de 50 caracteres');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateDatabase(database: string): ValidationResult {
        const errors: string[] = [];
        const validDatabases = ['SqlServer', 'PostgreSQL', 'MySQL'];

        if (!database) {
            errors.push('Tipo de banco de dados é obrigatório');
        } else if (!validDatabases.includes(database)) {
            errors.push(`Banco de dados inválido. Use: ${validDatabases.join(', ')}`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

export class Validator {
    static validateEntityName(name: string): void {
        if (!name || typeof name !== 'string') {
            throw new ValidationError('Entity name is required and must be a string', 'name');
        }

        if (!/^[a-zA-Z0-9]+$/.test(name)) {
            throw new ValidationError('Entity name must contain only letters and numbers', 'name');
        }

        if (name.length < 2) {
            throw new ValidationError('Entity name must be at least 2 characters long', 'name');
        }

        if (name.length > 50) {
            throw new ValidationError('Entity name must be less than 50 characters', 'name');
        }
    }

    static validateFields(fields: string[]): void {
        if (!fields || !Array.isArray(fields)) {
            throw new ValidationError('Fields must be an array', 'fields');
        }

        if (fields.length === 0) {
            throw new ValidationError('At least one field must be provided', 'fields');
        }

        fields.forEach((field, index) => {
            if (!field || typeof field !== 'string') {
                throw new ValidationError(`Field at index ${index} must be a string`, 'fields');
            }

            if (!field.includes(':')) {
                throw new ValidationError(`Field "${field}" must include type (format: name:type)`, 'fields');
            }

            const parts = field.split(':');
            const fieldName = parts[0];
            const fieldType = parts[1];
            
            if (!fieldName || !fieldName.trim()) {
                throw new ValidationError(`Field name cannot be empty in "${field}"`, 'fields');
            }

            if (!fieldType || !fieldType.trim()) {
                throw new ValidationError(`Field type cannot be empty in "${field}"`, 'fields');
            }
        });
    }

    static validateCommandType(type: string): void {
        if (!type || typeof type !== 'string') {
            throw new ValidationError('Command type is required', 'type');
        }

        const validTypes = ['Create', 'Update', 'Delete', 'Get'];
        if (!validTypes.includes(type)) {
            throw new ValidationError(
                `Invalid command type "${type}". Valid types: ${validTypes.join(', ')}`,
                'type'
            );
        }
    }

    static validatePostgresFormat(postgres: string): { table: string; schema: string } {
        if (!postgres.includes(':')) {
            throw new ValidationError('Postgres format must be "table:schema"', 'postgres');
        }

        const parts = postgres.split(':');
        const table = parts[0];
        const schema = parts[1];
        
        if (!table || !table.trim()) {
            throw new ValidationError('Table name cannot be empty', 'postgres');
        }

        if (!schema || !schema.trim()) {
            throw new ValidationError('Schema name cannot be empty', 'postgres');
        }

        return { table: table.trim(), schema: schema.trim() };
    }
}