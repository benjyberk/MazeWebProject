using MazeLib;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    /*
     * The Multiplayer Maze Game holds references to two players and their positions in a maze
     */
    public class MultiplayerMazeGame
    {
        public SearchableMaze maze
        {
            get;
        }

        public string name
        {
            get;
        }

        private bool joinable;
        private Dictionary<TcpClient, Position> players;
        private Dictionary<TcpClient, StreamWriter> playerConnections;

        // The maze is provided by the constructor, and the game holds a reference to the players
        // In a dictionary
        public MultiplayerMazeGame(SearchableMaze maze)
        {
            this.maze = maze;
            this.name = maze.name;
            joinable = true;
            players = new Dictionary<TcpClient, Position>();
            playerConnections = new Dictionary<TcpClient, StreamWriter>();
        }

        /*
         * Add player adds a player to the game, if the required number of players is met
         * The second-player is returned, to allow the maze to send itself back.
         */
        public void AddPlayer(TcpClient newPlayer)
        {
            players.Add(newPlayer, maze.getInitialState().state);
            // If enough players have joined, we start the game (i.e. send back the socket
            // of the other player)
            if (players.Count == 2)
            {
                joinable = false;
                SendPlayersMaze();
            }
        }

        /*
         * A private method which sends the two clients the maze so that they can
         * start playing it.
         */
        private void SendPlayersMaze()
        {
            foreach (KeyValuePair<TcpClient,Position> player in players)
            {
                NetworkStream stream = player.Key.GetStream();
                StreamWriter writer = new StreamWriter(stream);
                string response = maze.toJSON().Replace("\r", String.Empty);
                response = response.Replace("\n", String.Empty);
                writer.WriteLine(response);
                writer.Flush();
                Console.WriteLine("Sending back to {0}: {1} ", player.Key.GetHashCode(), response);
                // The StreamWriters are saved for the future
                playerConnections.Add(player.Key, writer);
            }
        }

        /*
         * The Move command moves the player, then returns the position to be sent to the second
         * player
         */
        public void Move(TcpClient mover, string direction)
        {
                Position playerPos = players[mover];
                if (direction == "up")
                {
                    playerPos.Row--;
                }
                else if (direction == "down")
                {
                    playerPos.Row++;
                }
                else if (direction == "left")
                {
                    playerPos.Col--;
                }
                else if (direction == "right")
                {
                    playerPos.Col++;
                }

                AlertOtherPlayer(mover, direction);
        }

        /*
         * This method alerts the second player that the other player has moved
         */
        private void AlertOtherPlayer(TcpClient mover, string direction)
        {
            // Generate the Json Object to send
            JObject playerAlert = new JObject();
            playerAlert["Name"] = maze.name;
            playerAlert["Direction"] = direction;
            string message = playerAlert.ToString();
            message = message.Replace("\n", String.Empty);
            message = message.Replace("\r", String.Empty);
            // We get the stream (saved from previously) to send the other player
            TcpClient other = GetOtherPlayer(mover);
            // We send the message
            playerConnections[other].WriteLine(message);
            playerConnections[other].Flush();
        }

        /*
         * A helper method to get the second player, given one player.
         */
        public TcpClient GetOtherPlayer(TcpClient player1)
        {
            foreach (KeyValuePair<TcpClient, Position> player2 in players)
            {
                if (player2.Key != player1)
                {
                    return player2.Key;
                }
            }
            return null;
        }

        /*
         * When one player wants to cancel the game, the other user is alerted
         */
        public void CancelGame(TcpClient player)
        {
            // We get the stream (saved from previously) to send the other player
            TcpClient other = GetOtherPlayer(player);
            // We send the message
            if (other != null)
            {
                playerConnections[other].Dispose();
            }
        }

        /*
         * Indicates whether the game is full (already has 2 players)
         */
        public bool CanJoin()
        {
            return joinable;
        }
    }
}
