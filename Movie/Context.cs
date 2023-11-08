using Microsoft.EntityFrameworkCore;
using Movie.Models;

namespace Movie
{
    public class Context : DbContext
    {
        public DbSet<Buyer> Buyers { get; set; }

        public DbSet<Cinema> Cinemas { get; set; }

        public DbSet<Company> Companies { get; set; }

        public DbSet<Film> Films { get; set; }

        public DbSet<FilmView> FilmViews { get; set; }

        public DbSet<Hall> Halls { get; set; }

        public DbSet<Seat> Seats { get; set; }

        public DbSet<SeatBooking> SeatsBooking { get; set; }

        public DbSet<User> Users { get; set; }

        public Context()
        {
            //Database.EnsureDeleted();
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=SQL6031.site4now.net;Initial Catalog=db_aa1317_db;User Id=db_aa1317_db_admin;Password=123456aA_");
        }
    }
}
