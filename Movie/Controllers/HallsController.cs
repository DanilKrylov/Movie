using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movie.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HallsController : ControllerBase
    {
        private readonly Context _context;

        public HallsController(Context context)
        {
            _context = context;
        }

        // GET: api/Halls
        [HttpGet]
        public ActionResult<IEnumerable<Hall>> GetHalls()
        {
            var halls = _context.Halls.ToList();
            return Ok(halls);
        }

        // GET: api/Halls/5
        [HttpGet("{id}")]
        public ActionResult<Hall> GetHall(int id)
        {
            var hall = _context.Halls.FirstOrDefault(m => m.Id == id);

            if (hall == null)
            {
                return NotFound();
            }

            return Ok(hall);
        }

        // POST: api/Halls
        [HttpPost]
        public async Task<IActionResult> PostHall(Hall hall)
        {
                _context.Halls.Add(hall);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetHall", new { id = hall.Id }, hall);
        }

        // PUT: api/Halls/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHall(int id, Hall hall)
        {
            if (id != hall.Id)
            {
                return BadRequest();
            }

            var dbSeats = _context.Seats.Where(m => m.HallId == id);
            _context.RemoveRange(dbSeats);
            _context.Halls.Update(hall);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HallExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Halls/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHall(int id)
        {
            var hall = await _context.Halls.FindAsync(id);
            if (hall == null)
            {
                return NotFound();
            }

            _context.Halls.Remove(hall);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HallExists(int id)
        {
            return _context.Halls.Any(e => e.Id == id);
        }
    }
}
