using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Models;
using System.Collections.Concurrent;
using Newtonsoft.Json.Linq;
using MazeWebProject.Models;
using System.Threading.Tasks;

namespace MazeWebProject
{
    /// <summary>
    /// The SignalR controller/hub handles asynchronous communication with the client
    /// </summary>
    public class MultiplayerMazeHub : Hub
    {
        private static IModel model = new MazeGameModel();
        public static bool addValue = false;

        /// <summary>
        /// The 'StartMaze' command opens a new multiplayer game
        /// </summary>
        /// <param name="name"></param>
        /// <param name="rows"></param>
        /// <param name="columns"></param>
        public void StartMaze(string name, int rows, int columns)
        {
            // The first time we run this, we provide the needed delegate to our model
            if (!addValue) {
                model.UpdateClientEvent += SendMessage;
                addValue = true;
            }
            model.StartGame(name, rows, columns, Context.ConnectionId);
        }

        /// <summary>
        /// The Join Maze command communicates with the model to join the game
        /// </summary>
        /// <param name="name"></param>
        public void JoinMaze(string name)
        {
            model.JoinMultiplayerGame(name, Context.ConnectionId);
        }

        /// <summary>
        /// The MakeMove command communicates with the model to make a move
        /// </summary>
        /// <param name="direction"></param>
        public void MakeMove(string direction)
        {
            model.MakeMove(Context.ConnectionId, direction);
        }

        /// <summary>
        /// The GetList command communicates with the model to get hte list of open multiplayer games
        /// </summary>
        public void GetList()
        {
            List<string> list = model.GetActiveGames();
            Clients.Client(Context.ConnectionId).updateList(list);
        }
        /// <summary>
        /// The 'SendMessage' command is used purely as a delegate, given to the model
        /// to use when a message is ready to send to the client
        /// </summary>
        /// <param name="id"></param>
        /// <param name="content"></param>
        public void SendMessage(string id, JObject content)
        {
            // We decide which client-side function to use, and then send the info
            if (content["Direction"] != null)
            {
                Clients.Client(id).updatePosition(content);
            }
            else if (content["Maze"] != null)
            {
                Clients.Client(id).getMaze(content);
            }
        }
        
    }
}