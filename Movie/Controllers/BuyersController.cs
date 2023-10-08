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
    public class BuyersController : ControllerBase
    {
        private readonly Context _context;

        public BuyersController(Context context)
        {
            _context = context;
        }

        // GET: api/Buyers
        [HttpGet]
        public ActionResult<IEnumerable<Buyer>> GetBuyers()
        {
            var buyers = _context.Buyers.ToList();
            return Ok(buyers);
        }

        // GET: api/Buyers/5
        [HttpGet("{id}")]
        public ActionResult<Buyer> GetBuyer(string id)
        {
            var buyer = _context.Buyers.FirstOrDefault(m => m.Login == id);

            if (buyer == null)
            {
                return NotFound();
            }

            return Ok(buyer);
        }

        // POST: api/Buyers
        [HttpPost]
        public async Task<IActionResult> PostBuyer(Buyer buyer)
        {
            _context.Buyers.Add(buyer);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetBuyer", new { id = buyer.Login }, buyer);
        }

        // PUT: api/Buyers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBuyer(string id, Buyer buyer)
        {
            if (id != buyer.Login)
            {
                return BadRequest();
            }

            _context.Entry(buyer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BuyerExists(id))
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

        // DELETE: api/Buyers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBuyer(string id)
        {
            var buyer = await _context.Buyers.FindAsync(id);
            if (buyer == null)
            {
                return NotFound();
            }

            _context.Buyers.Remove(buyer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BuyerExists(string id)
        {
            return _context.Buyers.Any(e => e.Login == id);
        }
    }
}
