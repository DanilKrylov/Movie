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
    public class FilmsController : ControllerBase
    {
        private readonly Context _context;

        public FilmsController(Context context)
        {
            _context = context;
        }

        // GET: api/Films
        [HttpGet]
        public ActionResult<IEnumerable<Film>> GetFilms()
        {
            var films = _context.Films.ToList();
            return Ok(films);
        }

        // GET: api/Films/5
        [HttpGet("{id}")]
        public ActionResult<Film> GetFilm(int id)
        {
            var film = _context.Films.FirstOrDefault(m => m.Id == id);

            if (film == null)
            {
                return NotFound();
            }

            return Ok(film);
        }

        // POST: api/Films
        [HttpPost]
        public async Task<IActionResult> PostFilm(Film film)
        {
            _context.Films.Add(film);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetFilm", new { id = film.Id }, film);
        }

        // PUT: api/Films/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFilm(int id, Film film)
        {
            if (id != film.Id)
            {
                return BadRequest();
            }

            _context.Entry(film).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FilmExists(id))
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

        // DELETE: api/Films/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFilm(int id)
        {
            var film = await _context.Films.FindAsync(id);
            if (film == null)
            {
                return NotFound();
            }

            _context.Films.Remove(film);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FilmExists(int id)
        {
            return _context.Films.Any(e => e.Id == id);
        }
    }
}
