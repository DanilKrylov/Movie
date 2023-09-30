namespace Movie.Models
{
    public class SeatBooking
    {
        public int Id { get; set; }
        public Buyer Buyer { get; set; }
        public FilmView FilmView { get; set; }
    }
}
