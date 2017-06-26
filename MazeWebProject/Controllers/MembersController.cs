using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using MazeWebProject.Models;
using System.Security.Cryptography;
using System.Text;

namespace MazeWebProject.Controllers
{
    /// <summary>
    /// The members controller handles all queries to the members database
    /// </summary>
    public class MembersController : ApiController
    {
        private MazeWebProjectContext db = new MazeWebProjectContext();

        /// <summary>
        /// The function returns a list of all members (however only their name, wins and losses)
        /// </summary>
        /// <returns></returns>
        // GET: api/Members
        public List<ReturnResult> GetAllMembers()
        {
            // First the query is constructed, the 'return result' is a holder class for the result
            IQueryable<ReturnResult> query = db.Members.Select(mem => new ReturnResult {
                Username = mem.Username,
                Wins = mem.Wins,
                Losses = mem.Losses });
            // We perform the query and make it a list
            List<ReturnResult> retList = query.ToList();
            // We sort our list by Wins-Losses
            retList.Sort((x, y) => -1 * (x.Wins - x.Losses).CompareTo(y.Wins - y.Losses));
            return retList;
        }

        /// <summary>
        /// We see if the user submitted password matches the hashed password in our database
        /// </summary>
        /// <param name="user">The username</param>
        /// <param name="details">The password</param>
        /// <returns></returns>
        // GET: api/Members/id/password
        [ResponseType(typeof(string))]
        public IHttpActionResult GetLoginMember(string user, string details)
        {
            // We create the SHA1 Hash
            SHA1 sha = SHA1.Create();
            byte[] buffer = Encoding.ASCII.GetBytes(details);
            byte[] hash = sha.ComputeHash(buffer);
            string hash64 = Convert.ToBase64String(hash);

            // We search to see if the login exists
            Member member = db.Members.Find(user);
            if (member == null)
            {
                return NotFound();
            }
            // We see if our password matches the hash
            else if (member.Password != hash64)
            {
                return Unauthorized();
            }

            return Ok(member.Username);
        }

        /// <summary>
        /// The function used to add a new member
        /// </summary>
        /// <param name="member">The member to add</param>
        /// <returns></returns>
        // POST: api/Members
        [ResponseType(typeof(Member))]
        public IHttpActionResult PostRegisterMember(Member member)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // We compute the password hash to save
            SHA1 sha = SHA1.Create();
            byte[] buffer = Encoding.ASCII.GetBytes(member.Password);
            byte[] hash = sha.ComputeHash(buffer);
            string hash64 = Convert.ToBase64String(hash);

            // We add the member to the database
            member.Password = hash64;
            db.Members.Add(member);

            try
            {
                // We save the changes
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                // If the member already exists, we return an error
                if (MemberExists(member.Username))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = member.Username }, member);
        }

        /// <summary>
        /// We use an HTTP put to update a players score
        /// </summary>
        /// <param name="user"></param>
        /// <param name="details"></param>
        /// <returns></returns>
        [HttpPut]
        [ResponseType(typeof(string))]
        public IHttpActionResult PutUpdateScore(string user, string details)
        {
            // We attempt to find the user
            Member found = db.Members.Find(user);
            if (found != null)
            {
                // If we are reporting a win, we add to the win-count
                if (details == "win")
                {
                    found.Wins++;
                }
                // Otherwise, add to the loss count
                else
                {
                    found.Losses++;
                }
                // We save our changes and return our information
                db.SaveChanges();
                string retString = found.Wins + " wins, " + found.Losses + " losses.";
                return Ok(retString);
            }
            else
            {
                return NotFound();
            }
        }

        /// <summary>
        /// An auto-generated helper method
        /// </summary>
        /// <param name="disposing"></param>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        /// <summary>
        /// An auto-generated helper method
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        private bool MemberExists(string id)
        {
            return db.Members.Count(e => e.Username == id) > 0;
        }
    }
}