using System;
{{#hasCollections}}
using System.Collections.Generic;
{{/hasCollections}}
{{#database}}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
{{/database}}

namespace Domain.Entities
{
    {{#database}}{{{database}}}{{/database}}
    public class {{name}} {{#baseSkip}}{{/baseSkip}}{{^baseSkip}}: BaseEntity {{/baseSkip}}
    {
        public {{name}}() 
        {
{{#initializeCollections}}
            {{.}}
{{/initializeCollections}}
        }
        
        public {{name}}({{structureConstructor}})
        {
{{& structureEntityThis}}
        }
        
{{& structureEntityPublic}}
    }
}