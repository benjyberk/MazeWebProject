using MazeLib;
using Newtonsoft.Json.Linq;
using SearchAlgorithmsLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public delegate void SendMessage(string id, JObject contents);

    public interface IModel
    {
        SearchableMaze GenerateMaze(string name, int rows, int cols);
        Solution<Position> SolveMaze(string mazeName, int solutionType);
        void StartGame(string name, int rows, int cols, string user);
        List<string> GetActiveGames();
        bool JoinMultiplayerGame(string name, string player);
        bool MakeMove(string player, string move);
        bool CancelGame(string player);
        event SendMessage UpdateClientEvent;
    }
}
