﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MazeLib;
using System.Net.Sockets;
using SearchAlgorithmsLib;
using MazeGeneratorLib;


namespace Models
{
    /*
     * The Maze Game Model contains all functionality for creation, solving and general management
     * of singleplayer and multiplayer maze games.
     */
    class MazeGameModel : IModel
    {
        private Dictionary<string, SearchableMaze> singlePlayerMazes;
        private Dictionary<string, Solution<Position>> singlePlayerSolutions;
        private Dictionary<string, MultiplayerMazeGame> multiplayerMazes;
        private Dictionary<TcpClient, MultiplayerMazeGame> playerToGameMap;
        private BestFirstSearcher<Position> bfs;
        private DepthFirstSearcher<Position> dfs;
        private DFSMazeGenerator mazeMaker;

        /// <summary>
        /// The constructor generates the required objects
        /// </summary>
        public MazeGameModel()
        {
            mazeMaker = new DFSMazeGenerator();
            singlePlayerMazes = new Dictionary<string, SearchableMaze>();
            singlePlayerSolutions = new Dictionary<string, Solution<Position>>();
            multiplayerMazes = new Dictionary<string, MultiplayerMazeGame>();
            playerToGameMap = new Dictionary<TcpClient, MultiplayerMazeGame>();
            bfs = new BestFirstSearcher<Position>();
            dfs = new DepthFirstSearcher<Position>();
        }
        /*
         * The generate command creates a single player maze, which is added to the database
         * and then returned to the user
         */
        public SearchableMaze GenerateMaze(string name, int rows, int cols)
        {
            Maze m = mazeMaker.Generate(rows, cols);
            SearchableMaze maze = new SearchableMaze(m, name);
            // The maze is saved in the database
            if (!singlePlayerMazes.ContainsKey(name))
            {
                singlePlayerMazes.Add(name, maze);
            }
            else
            {
                singlePlayerMazes[name] = maze;
                if (singlePlayerSolutions.ContainsKey(name))
                {
                    singlePlayerSolutions.Remove(name);
                }
            }
            return maze;
        }

        /*
         * The solve-maze command solves a single player maze that already exists in the database
         * If the given maze does not exist, null is returned
         */
        public Solution<Position> SolveMaze(string mazeName, int solutionType)
        {
            Solution<Position> solution;
            // If the maze does not exist, it cannot be solved
            if (!singlePlayerMazes.ContainsKey(mazeName))
            {
                return null;
            }
            // If the maze hasn't already been solved, solve it
            else if (!singlePlayerSolutions.ContainsKey(mazeName))
            {
                ISearcher<Position> searcher;
                // Note: only 0 and 1 are handled here, error checking is done by the 'ICommand'
                if (solutionType == 0)
                {
                    searcher = bfs;
                }
                else
                {
                    searcher = dfs;
                }
                // The solution is generated by the given searcher
                solution = searcher.search(singlePlayerMazes[mazeName]);
                // Add the solution to the cache for later use
                singlePlayerSolutions[mazeName] = solution;
            }
            else
            {
                // If the solution already exists in cache, we return it
                solution = singlePlayerSolutions[mazeName];
            }
            return solution;
        }

        /*
         * StartGame creates a new multiplayer game, generating the maze and registering
         * the client to the game
         */
        public void StartGame(string name, int rows, int cols, TcpClient user)
        {
            Maze baseMaze = mazeMaker.Generate(rows, cols);
            baseMaze.Name = name;
            SearchableMaze maze = new SearchableMaze(baseMaze, baseMaze.Name);
            MultiplayerMazeGame oneGame = new MultiplayerMazeGame(maze);

            // We add the player to the game we just created
            oneGame.AddPlayer(user);
            // We place the maze into our database
            if (!multiplayerMazes.ContainsKey(name))
            {
                multiplayerMazes.Add(name, oneGame);
            }
            else
            {
                multiplayerMazes[name] = oneGame;
            }

            if (!playerToGameMap.ContainsKey(user))
            {
                playerToGameMap.Add(user, oneGame);
            }
            else
            {
                playerToGameMap[user] = oneGame;
            }
        }

        /*
         * Returns a list of active multiplayer games
         */
        public List<string> GetActiveGames()
        {
            List<string> returnList = new List<string>();
            foreach (KeyValuePair<string, MultiplayerMazeGame> oneGame in multiplayerMazes)
            {
                // If the game is full, it does not show up on the list any more
                if (oneGame.Value.CanJoin())
                {
                    returnList.Add(oneGame.Key);
                }
            }
            return returnList;
        }

        /*
         * A method which joins a client to an existing multiplayer game
         * Returns false if no such game exists
         */
        public bool JoinMultiplayerGame(string name, TcpClient player)
        {
            if (!multiplayerMazes.ContainsKey(name))
            {
                return false;
            }
            else if (multiplayerMazes[name].CanJoin())
            {
                multiplayerMazes[name].AddPlayer(player);
                // We associate the player with this game
                playerToGameMap.Add(player, multiplayerMazes[name]);
                return true;
            }
            // If the game already has two players, it cannot be joined
            else
            {
                return false;
            }
        }

        /*
         * The function checks if there is a player associated with a game, and if so, makes the
         * move for him
         */
        public bool MakeMove(TcpClient player, string move)
        {
            if (!playerToGameMap.ContainsKey(player))
            {
                return false;
            }
            playerToGameMap[player].Move(player, move);
            return true;
        }

        /*
         * This command cancels a multiplayer game 
         */
        public bool CancelGame(TcpClient player)
        {
            if (!playerToGameMap.ContainsKey(player))
            {
                return false;
            }
            else
            {
                MultiplayerMazeGame game = playerToGameMap[player];
                // We remove the game from the list of games
                multiplayerMazes.Remove(game.name);
                // We remove the players from the list of players
                playerToGameMap.Remove(game.GetOtherPlayer(player));
                playerToGameMap.Remove(player);
                // We cancel the game
                game.CancelGame(player);
                return true;
            }
        }
    }
}
