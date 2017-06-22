using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Models;
using System.Collections.Concurrent;
using Newtonsoft.Json.Linq;

namespace MazeWebProject
{
    public class MultiplayerMazeHub : Hub
    {
        private static IModel model = new MazeGameModel();
        private static ConcurrentDictionary<string, string> connections = 
            new ConcurrentDictionary<string,string>();
        public static bool addValue = false;

        public void StartMaze(string name, int rows, int columns)
        {
            if (!addValue) {
                model.UpdateClientEvent += SendMessage;
                addValue = true;
            }
            model.StartGame(name, rows, columns, Context.ConnectionId);
        }

        public void JoinMaze(string name)
        {
            model.JoinMultiplayerGame(name, Context.ConnectionId);
        }

        public void MakeMove(string direction)
        {
            model.MakeMove(Context.ConnectionId, direction);
        }

        public void GetList()
        {
            List<string> list = model.GetActiveGames();
            Clients.Client(Context.ConnectionId).updateList(list);
        }

        public void SendMessage(string id, JObject content)
        {
            if (content["Direction"] != null)
            {
                Clients.Client(id).updatePosition(content);
            }
            else if (content["Maze"] != null)
            {
                Clients.Client(id).getMaze(content);
            }
            else
            {
                //Clients.Client(id).exitGame();
            }
        }
        
    }
}