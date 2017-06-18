using MazeLib;
using SearchAlgorithmsLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public interface IModel
    {
        SearchableMaze GenerateMaze(string name, int rows, int cols);
        Solution<Position> SolveMaze(string mazeName, int solutionType);
        void StartGame(string name, int rows, int cols, TcpClient user);
        List<string> GetActiveGames();
        bool JoinMultiplayerGame(string name, TcpClient player);
        bool MakeMove(TcpClient player, string move);
        bool CancelGame(TcpClient player);
    }
}
