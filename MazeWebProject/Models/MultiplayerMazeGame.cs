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
        private Dictionary<string, Position> players;
        private Dictionary<TcpClient, StreamWriter> playerConnections;
        public event SendMessage SendMessageEvent;

        // The maze is provided by the constructor, and the game holds a reference to the players
        // In a dictionary
        public MultiplayerMazeGame(SearchableMaze maze)
        {
            this.maze = maze;
            this.name = maze.name;
            joinable = true;
            players = new Dictionary<string, Position>();
            playerConnections = new Dictionary<TcpClient, StreamWriter>();
        }

        /*
         * Add player adds a player to the game, if the required number of players is met
         * The second-player is returned, to allow the maze to send itself back.
         */
        public void AddPlayer(string newPlayer)
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
            foreach (KeyValuePair<string,Position> player in players)
            {
                string response = maze.toJSON();
                JObject json = JObject.Parse(response);
                SendMessageEvent?.Invoke(player.Key, json);
            }
        }

        /*
         * The Move command moves the player, then returns the position to be sent to the second
         * player
         */
        public void Move(string mover, string direction)
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
        private void AlertOtherPlayer(string mover, string direction)
        {
            // Generate the Json Object to send
            JObject playerAlert = new JObject();
            playerAlert["Name"] = maze.name;
            playerAlert["Direction"] = direction;
            // We get the stream (saved from previously) to send the other player
            string other = GetOtherPlayer(mover);
            // We send the message
            SendMessageEvent?.Invoke(other, playerAlert);
        }

        /*
         * A helper method to get the second player, given one player.
         */
        public string GetOtherPlayer(string player1)
        {
            foreach (KeyValuePair<string, Position> player2 in players)
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
        public void CancelGame(string player)
        {
            // We get the stream (saved from previously) to send the other player
            string other = GetOtherPlayer(player);
            // We send the message
            if (other != null)
            {
                SendMessageEvent?.Invoke(other, null);
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
