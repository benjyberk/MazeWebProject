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
    public class MazeController : ApiController
    {
        private static IModel model = new MazeGameModel();

        // GET: api/Maze
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Maze/5
        public string Get(int id)
        {
            return "value";
        }

        // GET: api/Maze/Benjy/5/5
        public JObject GetGeneratedMaze(string name, int rows, int columns)
        {
            SearchableMaze m = model.GenerateMaze(name, rows, columns);
            string json = m.toJSON();
            Console.WriteLine(json);
            return JObject.Parse(json);
        }

        // GET: api/Maze/Benjy/0
        public JObject GetSolution(string name, int algorithm)
        {
            Solution<Position> solution = model.SolveMaze(name, algorithm);
            JObject solutionObject = new JObject();

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


        // POST: api/Maze
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Maze/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Maze/5
        public void Delete(int id)
        {
        }
    }
}
