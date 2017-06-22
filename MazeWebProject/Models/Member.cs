using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MazeWebProject.Models
{
    public class Member
    {
        [Key]
        public string Username;
        [Required]
        public string Password;
        [Required]
        public string Email;
        public int Wins;
        public int Losses;
    }
}