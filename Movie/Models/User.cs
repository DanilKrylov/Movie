using System.ComponentModel.DataAnnotations;

namespace Movie.Models
{
    public abstract class User
    {
        [Key]
        public string Login { get; set; }

        public string Password { get; set; }
    }
}
