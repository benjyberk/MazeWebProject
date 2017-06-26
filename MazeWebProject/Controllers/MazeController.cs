using MazeLib;
using Models;
using Newtonsoft.Json.Linq;
using SearchAlgorithmsLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MazeWebProject.Controllers
{
    /// <summary>
    /// The Maze controller handles all requests that require a generated/solved maze
    /// </summary>
    public class MazeController : ApiController
    {
        private static IModel model = new MazeGameModel();

        /// <summary>
        /// The GetGeneratedMaze function generates a maze using the model
        /// </summary>
        /// <param name="name">The maze name</param>
        /// <param name="rows">Number of rows to generate</param>
        /// <param name="columns">Number of columns to generate</param>
        /// <returns></returns>
        // GET: api/Maze/Benjy/5/5
        public JObject GetGeneratedMaze(string name, int rows, int columns)
        {
            SearchableMaze m = model.GenerateMaze(name, rows, columns);
            string json = m.toJSON();
            Console.WriteLine(json);
            // The maze is re-serialized and returned as a jObject (which is auto-converted to json)
            return JObject.Parse(json);
        }

        // GET: api/Maze/Benjy/0
        public JObject GetSolution(string name, int algorithm)
        {
            Solution<Position> solution = model.SolveMaze(name, algorithm);
            JObject solutionObject = new JObject();
            // If the solution exists we return it
            if (solution == null)
            {
                return null;
            }
            else
            {
                // A helper method is used to translate the list of positions into 'directions'
                string directions = DirectionFromSolution(solution);
                solutionObject["Solution"] = directions;
                solutionObject["NodesEvaluated"] = solution.nodesEvaluated;
            }

            return solutionObject;
        }

        /// <summary>
        /// A helper method used to extract only the direction steps from
        /// the 'solution', which is a collection of states
        /// </summary>
        /// <param name="solution">The generated solution</param>
        /// <returns></returns>
        private string DirectionFromSolution(Solution<Position> solution)
        {
            Position previous = solution.solutionPath[0].state;
            string returnString = "";
            // We skip the first element (which will always exist - the minimum amount of moves
            // is 1
            foreach (State<Position> p in solution.solutionPath.Skip(1))
            {
                if (p.state.Col == previous.Col)
                {
                    if (p.state.Row > previous.Row)
                    {
                        // Down
                        returnString += "3";
                    }
                    else
                    {
                        // Up
                        returnString += "2";
                    }
                }
                else
                {
                    if (p.state.Col > previous.Col)
                    {
                        // Right
                        returnString += "1";
                    }
                    else
                    {
                        // Left
                        returnString += "0";
                    }
                }
                previous = p.state;
            }
            return returnString;
        }
    }
}
