namespace Movie.Models
{
    public class Hall
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CinemaId { get; set; }

        public Cinema Cinema { get; set; }
        public List<Seat> Seats { get; set; }
        public List<FilmView> FilmViews { get; set; }
    }
}
