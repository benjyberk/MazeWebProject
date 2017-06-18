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
        public Solution<Position> GetSolution(string name, int algorithm)
        {
            Solution<Position> solution = model.SolveMaze(name, algorithm);
            return solution;
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
