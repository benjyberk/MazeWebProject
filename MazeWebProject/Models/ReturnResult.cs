using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MazeWebProject.Models
{
    /// <summary>
    /// A helper class used to generate database query responses
    /// </summary>
    public class ReturnResult
    {
        public string Username { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }
    }
}