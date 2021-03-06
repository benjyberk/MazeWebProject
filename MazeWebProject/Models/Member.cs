﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MazeWebProject.Models
{
    /// <summary>
    /// A class used to hold our database information
    /// </summary>
    public class Member
    {
        [Key]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Email { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }
    }
}