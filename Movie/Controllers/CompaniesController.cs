using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movie.Models;
using Movie.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly Context _context;

        public CompaniesController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Company>> GetCompanies()
        {
            var companies = _context.Companies.ToList();
            return Ok(companies);
        }

        [HttpGet("info")]
        [Authorize]
        public ActionResult<Company> GetCompanyInfo()
        {
            var login = User.Identity.Name;
            var company = _context.Companies.First(c => c.Login == login);
            return Ok(company);
        }

        [HttpGet("{id}")]
        public ActionResult<Company> GetCompany(string id)
        {
            var company = _context.Companies.FirstOrDefault(m => m.Login == id);

            if (company == null)
            {
                return NotFound();
            }

            return Ok(company);
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> PutCompany([FromForm]EditCompanyViewModel company)
        {
            var login = User.Identity.Name;
            var dbCompany = await _context.Companies.FirstAsync(m => m.Login == login);
            dbCompany.Name = company.Name ?? dbCompany.Name;
            dbCompany.Address = company.Address ?? dbCompany.Address;

            if(company.Logo != null)
            {
                using var stream = new MemoryStream();
                company.Logo.CopyTo(stream);
                var newLogo = stream.ToArray();
                dbCompany.Logo = newLogo;
            }
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(string id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null)
            {
                return NotFound();
            }

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CompanyExists(string id)
        {
            return _context.Companies.Any(e => e.Login == id);
        }
    }
}
