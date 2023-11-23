using Movie.Models;

namespace Movie.ViewModels
{
    public class FilmPutModel : FilmPostModel
    {
        public int Id { get; set; }

        public new Film ToModel()
        {
            return new Film()
            {
                Id = Id,
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
