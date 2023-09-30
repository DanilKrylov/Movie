namespace Movie.Models
{
    public class Hall
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Seat> Seats { get; set; }
    }
}
