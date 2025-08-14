using Core.Entities;
using Core.Repositories;
using Infrastructure.Data;
using Infrastructure.Repositories.Contracts;

namespace Infrastructure.Repositories
{
    public class {{name}}Repository :
        RepositoryBase<{{name}}Entity>,
        I{{name}}Repository
    {
        public {{name}}Repository(ApplicationDbContext context, bool SaveChanges = true) : base(context, SaveChanges) { }
    }
}
