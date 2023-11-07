using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movie.Models;
using Movie.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CinemasController : ControllerBase
    {
        private readonly Context _context;

        public CinemasController(Context context)
        {
            _context = context;
        }



        // GET: api/Companies
        [Authorize]
        [HttpGet("forCompany")]
        public ActionResult<IEnumerable<Company>> GetCinemasForCompany()
        {
            var login = User.Identity.Name;
            var companies = _context.Cinemas
                .Include(c => c.Company)
                .Where(c => c.Company.Login == login)
                .Include(c => c.Halls).ToList();
            return Ok(companies);
        }

        // GET: api/Cinemas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cinema>>> GetCinemas()
        {
            var cinemas = await _context.Cinemas.ToListAsync();
            return Ok(cinemas);
        }

        // GET: api/Cinemas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cinema>> GetCinema(int id)
        {
            var cinema = await _context.Cinemas
                .Include(c => c.Halls).FirstOrDefaultAsync(c => c.Id == id);

            if (cinema == null)
            {
                return NotFound();
            }

            return Ok(cinema);
        }

        [HttpPost]
        public async Task<ActionResult<Cinema>> PostCinema([FromForm]CinemaPostModel cinema)
        {
            var cinemaModel = new Cinema()
            {
                Location = cinema.Location,
                Logo = FormFileByteConverter.Convert(cinema.Logo),
                CompanyLogin = cinema.CompanyLogin,
                Description = cinema.Description,
                Name = cinema.Name,
            };

            _context.Cinemas.Add(cinemaModel);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetCinema", new { id = cinemaModel.Id }, cinema);
        }

        [HttpPut]
        public async Task<IActionResult> PutCinema(EditCinemaModel editModel)
        {
            var cinema = _context.Cinemas.First(c => c.Id == editModel.Id);
            cinema.Name = editModel.Name;
            cinema.Location = editModel.Location;
            cinema.Description = editModel.Description;
            cinema.Logo = FormFileByteConverter.Convert(editModel.Logo);

            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/Cinemas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCinema(int id)
        {
            var cinema = await _context.Cinemas.FindAsync(id);
            if (cinema == null)
            {
                return NotFound();
            }

            _context.Cinemas.Remove(cinema);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CinemaExists(int id)
        {
            return _context.Cinemas.Any(e => e.Id == id);
        }
    }
}
