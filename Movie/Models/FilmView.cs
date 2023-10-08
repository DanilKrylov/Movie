namespace Movie.Models
{
    public class FilmView
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public int FilmId { get; set; }

        public Film Film { get; set; }

        public int HallId { get; set; }

        public Hall Hall { get; set; }
    }
}
