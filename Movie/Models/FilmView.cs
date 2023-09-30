namespace Movie.Models
{
    public class FilmView
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public Film Film { get; set; }
        public Hall Hall { get; set; }
    }
}
