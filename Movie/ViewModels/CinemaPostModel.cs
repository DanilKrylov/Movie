namespace Movie.ViewModels
{
    public class CinemaPostModel
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public IFormFile Logo { get; set; }
        public string CompanyLogin { get; set; }
    }
}
