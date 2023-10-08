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
    public class SeatBookingsController : ControllerBase
    {
        private readonly Context _context;

        public SeatBookingsController(Context context)
        {
            _context = context;
        }

        // GET: api/SeatBookings
        [HttpGet]
        public ActionResult<IEnumerable<SeatBooking>> GetSeatBookings()
        {
            var seatBookings = _context.SeatsBooking.ToList();
            return Ok(seatBookings);
        }

        // GET: api/SeatBookings/5
        [HttpGet("{id}")]
        public ActionResult<SeatBooking> GetSeatBooking(int id)
        {
            var seatBooking = _context.SeatsBooking.FirstOrDefault(m => m.Id == id);

            if (seatBooking == null)
            {
                return NotFound();
            }

            return Ok(seatBooking);
        }

        // POST: api/SeatBookings
        [HttpPost]
        public async Task<IActionResult> PostSeatBooking(SeatBooking seatBooking)
        {
            _context.SeatsBooking.Add(seatBooking);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSeatBooking", new { id = seatBooking.Id }, seatBooking);
        }

        // PUT: api/SeatBookings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSeatBooking(int id, SeatBooking seatBooking)
        {
            if (id != seatBooking.Id)
            {
                return BadRequest();
            }

            _context.Entry(seatBooking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeatBookingExists(id))
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

        // DELETE: api/SeatBookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeatBooking(int id)
        {
            var seatBooking = await _context.SeatsBooking.FindAsync(id);
            if (seatBooking == null)
            {
                return NotFound();
            }

            _context.SeatsBooking.Remove(seatBooking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SeatBookingExists(int id)
        {
            return _context.SeatsBooking.Any(e => e.Id == id);
        }
    }
}
