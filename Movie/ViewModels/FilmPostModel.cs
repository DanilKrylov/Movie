using Movie.Models;

namespace Movie.ViewModels
{
    public class FilmPostModel
    {
        public string Title { get; set; }
        public string Director { get; set; }
        public string Description { get; set; }
        public int ReleaseYear { get; set; }
        public string Genre { get; set; }
        public int DurationMinutes { get; set; }

        public IFormFile Poster { get; set; }

        public Film ToModel()
        {
            return new Film()
            {
                Title = Title,
                Director = Director,
                Description = Description,
                ReleaseYear = ReleaseYear,
                Genre = Genre,
                DurationMinutes = DurationMinutes,
                Poster = FormFileByteConverter.Convert(Poster)
            };
        }
    }
}
