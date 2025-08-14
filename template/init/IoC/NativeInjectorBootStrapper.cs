using Application.Dictionary;
using Application.Handlers;
using Core.Helpers;
using Core.Repositories;
using Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace IoC
{
    public class NativeInjectorBootStrapper
    {
        public static void RegisterServices(IServiceCollection services)
        {

            #region Repositories
            #endregion

            #region Handlers
            #endregion

            #region Services
            #endregion

            #region Dictionary
            services.AddSingleton<DefaultDictionary>();
            #endregion

            #region Helper
            services.AddScoped<IMapper, Mapper>();
            #endregion

        }
    }
}