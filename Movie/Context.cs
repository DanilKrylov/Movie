using Microsoft.EntityFrameworkCore;
using Movie.Models;

namespace Movie
{
    public class Context : DbContext
    {
        public DbSet<Buyer> Buyers { get; set; }

        public DbSet<Company> Companies { get; set; }

        public DbSet<User> Users { get; set; }

        public Context()
        {
            //Database.EnsureDeleted();
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=movies;Trusted_Connection=True;");
        }
    }
}
