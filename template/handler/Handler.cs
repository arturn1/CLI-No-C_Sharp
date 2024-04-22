using Domain.Commands;
using Domain.Commands.Contracts;
using Domain.Entities;
using Domain.Handlers.Contracts;
using Domain.Helpers;
using Domain.Repositories;
using System.Net;

namespace Domain.Handlers
{
    public class {{name}}Handler{{#command}}{{^isFirst}}:{{/isFirst}}{{#isFirst}},{{else}}{{/isFirst}} IHandler<{{commandName}}>{{/command}}
    {
        {{#repository}}
        private readonly I{{name}}Repository _{{title}}Repository;
        {{/repository}}
        private readonly IMapper _mapper;
        public {{name}}Handler({{#repository}}I{{name}}Repository {{title}}Repository, {{/repository}}IMapper mapper)
        {
            {{#repository}}_{{title}}Repository = {{title}}Repository;
            {{/repository}}_mapper = mapper;
        }
        

        {{#command}}
        public async Task<ICommandResult> Handle({{commandName}} command)
        {
            command.IsCommandValid();

            if (!command.isValid)
            {
                return new CommandResult(command.Errors, HttpStatusCode.BadRequest);
            }

            {{#isUpdateCommand}}

            {{name}}Entity entity = await _{{title}}Repository.GetByIdAsync(command.Id);

            if (entity == null) return new CommandResult("Entity not found", HttpStatusCode.NotFound);

            _mapper.Map(command, entity);

            {{#repository}}
            await _{{title}}Repository.UpdateAsync(entity);
            {{/repository}}

            return new CommandResult(entity, HttpStatusCode.Created);
            
            {{/isUpdateCommand}}
            {{^isUpdateCommand}}

            {{name}}Entity entity = new ();
            _mapper.Map(command, entity);

            {{#repository}}
            await _{{title}}Repository.PostAsync(entity);
            {{/repository}}

            return new CommandResult(entity, HttpStatusCode.Created);
            {{/isUpdateCommand}}
        }

        {{/command}}
    }
}
