using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Models;
using System.Collections.Concurrent;

namespace MazeWebProject
{
    public class MultiplayerMazeHub : Hub
    {
        private static IModel model = new MazeGameModel();
        private static ConcurrentDictionary<string, string> connections = 
            new ConcurrentDictionary<string,string>();


        public void Hello()
        {
            Clients.All.hello();
        }
    }
}