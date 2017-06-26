using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(MazeWebProject.App_Start.Startup))]

/// <summary>
/// The startup class for the app, maps signalR
/// </summary>
namespace MazeWebProject.App_Start
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
