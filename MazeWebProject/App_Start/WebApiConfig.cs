using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Routing;

namespace MazeWebProject
{
    /// <summary>
    /// The Routing class holds all routes to connect from URIs to functions
    /// </summary>
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            // The generate maze route
            config.Routes.MapHttpRoute(
                name: "GenerateMaze",
                routeTemplate: "api/{controller}/{name}/{rows}/{columns}",
                defaults: new { name = "default_maze" },
                constraints: new { controller = "Maze" }
            );

            // The Solve Maze route
            config.Routes.MapHttpRoute(
                name: "SolveMaze",
                routeTemplate: "api/Maze/{name}/{algorithm}",
                defaults: new { controller = "Maze" }
            );

            // The MemberAccess route
            config.Routes.MapHttpRoute(
                name: "MemberAccess",
                routeTemplate: "api/Members/{user}/{details}",
                defaults: new { controller = "Members" }
            );

            // The standard routing
            config.Routes.MapHttpRoute(
               name: "DefaultApi",
               routeTemplate: "api/{controller}/{id}",
               defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
