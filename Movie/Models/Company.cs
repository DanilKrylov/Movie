namespace Movie.Models
{
    public class Company : User
    {
        public string Name { get; set; }

        public string Address { get; set; }

        public byte[] Logo { get; set; }

        public List<Cinema> Cinemas { get; set;}
    }
}
