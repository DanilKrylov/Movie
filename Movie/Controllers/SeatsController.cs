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
    public class SeatsController : ControllerBase
    {
        private readonly Context _context;

        public SeatsController(Context context)
        {
            _context = context;
        }

        // GET: api/Seats
        [HttpGet]
        public ActionResult<IEnumerable<Seat>> GetSeats()
        {
            var seats = _context.Seats.Include(s => s.Hall).ToList();
            return Ok(seats);
        }

        // GET: api/Seats/5
        [HttpGet("{id}")]
        public ActionResult<Seat> GetSeat(int id)
        {
            var seat = _context.Seats
                .Include(s => s.Hall)
                .FirstOrDefault(m => m.Id == id);

            if (seat == null)
            {
                return NotFound();
            }

            return Ok(seat);
        }

        // POST: api/Seats
        [HttpPost]
        public async Task<IActionResult> PostSeat(Seat seat)
        {
            if (ModelState.IsValid)
            {
                _context.Seats.Add(seat);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetSeat", new { id = seat.Id }, seat);
            }
            return BadRequest(ModelState);
        }

        // PUT: api/Seats/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSeat(int id, Seat seat)
        {
            if (id != seat.Id)
            {
                return BadRequest();
            }

            _context.Entry(seat).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeatExists(id))
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

        // DELETE: api/Seats/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeat(int id)
        {
            var seat = await _context.Seats.FindAsync(id);
            if (seat == null)
            {
                return NotFound();
            }

            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SeatExists(int id)
        {
            return _context.Seats.Any(e => e.Id == id);
        }
    }
}
