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
    public class FilmViewsController : ControllerBase
    {
        private readonly Context _context;

        public FilmViewsController(Context context)
        {
            _context = context;
        }

        // GET: api/FilmViews
        [HttpGet]
        public ActionResult<IEnumerable<FilmView>> GetFilmViews()
        {
            var filmViews = _context.FilmViews.ToList();
            return Ok(filmViews);
        }

        // GET: api/FilmViews/5
        [HttpGet("{id}")]
        public ActionResult<FilmView> GetFilmView(int id)
        {
            var filmView = _context.FilmViews.FirstOrDefault(m => m.Id == id);

            if (filmView == null)
            {
                return NotFound();
            }

            return Ok(filmView);
        }

        // POST: api/FilmViews
        [HttpPost]
        public async Task<IActionResult> PostFilmView(FilmView filmView)
        {
                _context.FilmViews.Add(filmView);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetFilmView", new { id = filmView.Id }, filmView);
        }

        // PUT: api/FilmViews/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFilmView(int id, FilmView filmView)
        {
            if (id != filmView.Id)
            {
                return BadRequest();
            }

            _context.Entry(filmView).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FilmViewExists(id))
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

        // DELETE: api/FilmViews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFilmView(int id)
        {
            var filmView = await _context.FilmViews.FindAsync(id);
            if (filmView == null)
            {
                return NotFound();
            }

            _context.FilmViews.Remove(filmView);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FilmViewExists(int id)
        {
            return _context.FilmViews.Any(e => e.Id == id);
        }
    }
}
