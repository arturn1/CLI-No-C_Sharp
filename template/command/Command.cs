using Core.Commands.Contracts;
using Core.Validation;
{{#hasCollections}}
using System.Collections.Generic;
{{/hasCollections}}
{{#hasEntities}}
using Core.Entities;
{{/hasEntities}}

namespace Core.Commands 
{

    public class {{name}} : ValidatableTypes, ICommand
    {
        public {{name}}({{#id}}Guid id, {{/id}}{{structureConstructor}})
        {
            {{#id}}this.Id = id;{{/id}}{{& structureEntityThis}}
        }{{#id}}

        public Guid Id { get; set; }{{/id}}{{& structureEntityPublic}}

        public bool IsCommandValid()
        {
            {{#id}}ValidateGuidNotEmpty(Id, "Id");
            
            {{/id}}return this.isValid;
        }
    }
}