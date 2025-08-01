export class Structure {
    private entity: Record<string, string> = {}
    private usings: Set<string> = new Set()

    constructor(fields: string[]) {
        fields.forEach((field) => {
            const [fieldName, fieldType] = field.split(':');
            const trimmedFieldName = fieldName.trim();
            const trimmedFieldType = fieldType ? fieldType.trim() : 'string';

            this.validateCSharpType(trimmedFieldType);

            this.entity[trimmedFieldName] = this.processType(trimmedFieldType);
        });
    }

    public getEntity(): Record<string, string> {
        return this.entity;
    }

    public processType(type: string): string {
        // Remove nullable indicator for processing
        const cleanType = type.replace('?', '');
        const isNullable = type.includes('?');
        
        let processedType = this.detectSpecialTypes(cleanType);
        
        // Handle generic types
        if (this.isGenericType(cleanType)) {
            processedType = this.processGenericType(cleanType);
        }
        
        // Add nullable back if needed
        return isNullable ? `${processedType}?` : processedType;
    }

    public detectSpecialTypes(type: string): string {
        const typeMap: Record<string, string> = {
            "guid": "Guid",
            "datetime": "DateTime",
            "timespan": "TimeSpan",
            "datetimeoffset": "DateTimeOffset",
            "decimal": "decimal",
            "string": "string",
            "int": "int",
            "long": "long",
            "short": "short",
            "byte": "byte",
            "bool": "bool",
            "double": "double",
            "float": "float",
            "char": "char"
        };

        // Check if it's a built-in type first
        const mappedType = typeMap[type.toLowerCase()];
        if (mappedType) {
            return mappedType;
        }

        // Check if it's a potential entity reference
        if (this.isPotentialEntityType(type)) {
            return this.processEntityType(type);
        }

        return type;
    }

    private isPotentialEntityType(type: string): boolean {
        // Check if the type starts with a letter (uppercase or lowercase)
        // and doesn't contain special characters that would indicate it's not a class name
        // Also exclude common generic type parameters like T, TKey, TValue
        return /^[a-zA-Z][a-zA-Z0-9]*$/.test(type) && 
               !['T', 'TKey', 'TValue', 'TEntity'].includes(type);
    }

    private processEntityType(type: string): string {
        // Convert entity name to proper EntityName format
        // For example: users -> UsersEntity, User -> UserEntity
        // Add a using statement for Domain.Entities if referencing other entities
        this.usings.add('using Domain.Entities;');
        
        // Convert to PascalCase and add Entity suffix
        const pascalCase = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        return pascalCase + "Entity";
    }

    public isGenericType(type: string): boolean {
        return type.includes('<') && type.includes('>');
    }

    public processGenericType(type: string): string {
        // Handle List<T>, ICollection<T>, IEnumerable<T>, etc.
        const genericMatch = type.match(/^(\w+)<(.+)>$/);
        
        if (!genericMatch) {
            return type;
        }

        const [, containerType, innerType] = genericMatch;
        const processedInnerType = this.processType(innerType.trim());
        
        // Add appropriate usings
        switch (containerType.toLowerCase()) {
            case 'list':
                this.usings.add('using System.Collections.Generic;');
                return `List<${processedInnerType}>`;
            case 'icollection':
                this.usings.add('using System.Collections.Generic;');
                return `ICollection<${processedInnerType}>`;
            case 'ienumerable':
                this.usings.add('using System.Collections.Generic;');
                return `IEnumerable<${processedInnerType}>`;
            case 'hashset':
                this.usings.add('using System.Collections.Generic;');
                return `HashSet<${processedInnerType}>`;
            case 'dictionary':
                this.usings.add('using System.Collections.Generic;');
                // Handle Dictionary<TKey, TValue>
                const types = innerType.split(',').map(t => this.processType(t.trim()));
                return `Dictionary<${types.join(', ')}>`;
            default:
                return `${containerType}<${processedInnerType}>`;
        }
    }

    public getRequiredUsings(): string[] {
        return Array.from(this.usings);
    }

    public structureConstructor(): string {
        let result = [];
        for (const key in this.entity) {
            if (this.entity.hasOwnProperty(key)) {
                result.push(`${this.entity[key]} ${key}`);
            }
        }
        return result.join(", ");
    }

    public structureEntityThis(): string {
        let result = "";
        for (const key in this.entity) {
            if (this.entity.hasOwnProperty(key)) {
                result += `            this.${key} = ${key};\n`;
            }
        }
        return result;
    }

    public structureEntityPublic(): string {
        let result = "";
        for (const key in this.entity) {
            if (this.entity.hasOwnProperty(key)) {
                result += `        public ${this.entity[key]} ${key} { get; set; }\n`;
            }
        }
        return result;
    }

    public validateCSharpType(type: string): void {
        // Remove nullable indicator and generic parts for validation
        const cleanType = type.replace('?', '');
        
        // If it's a generic type, validate the container and inner types
        if (this.isGenericType(cleanType)) {
            const genericMatch = cleanType.match(/^(\w+)<(.+)>$/);
            if (!genericMatch) {
                throw new Error(`Formato de tipo genérico inválido: ${type}`);
            }
            
            const [, containerType, innerType] = genericMatch;
            
            // Validate container type
            const validContainers = ['list', 'icollection', 'ienumerable', 'hashset', 'dictionary'];
            if (!validContainers.includes(containerType.toLowerCase())) {
                throw new Error(`Tipo de container não suportado: ${containerType}`);
            }
            
            // Validate inner type(s)
            if (containerType.toLowerCase() === 'dictionary') {
                const types = innerType.split(',');
                if (types.length !== 2) {
                    throw new Error(`Dictionary deve ter exatamente 2 tipos: ${type}`);
                }
                types.forEach(t => this.validateCSharpType(t.trim()));
            } else {
                this.validateCSharpType(innerType.trim());
            }
            return;
        }
        
        // Validate primitive types
        const csharpTypes = [
            'guid', 'string', 'int', 'double', 'bool', 'float', 'char', 
            'decimal', 'long', 'short', 'byte', 'datetime', 'timespan', 
            'datetimeoffset', 'object'
        ];

        if (!csharpTypes.includes(cleanType.toLowerCase())) {
            // Allow custom types (assume they are valid entity references)
            if (!/^[A-Za-z][A-Za-z0-9]*$/.test(cleanType)) {
                throw new Error(`Tipo inválido: ${type}`);
            }
        }
    }
}
