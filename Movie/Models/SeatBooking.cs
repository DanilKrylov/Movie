using System.ComponentModel.DataAnnotations.Schema;

namespace Movie.Models
{
    public class SeatBooking
    {
        public int Id { get; set; }
        public int FilmViewId { get; set; }
        public string BuyerLogin { get; set; }
        public FilmView FilmView { get; set; }
    }
}
