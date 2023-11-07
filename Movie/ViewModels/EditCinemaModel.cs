namespace Movie.ViewModels
{
    public class EditCinemaModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public IFormFile Logo { get; set; }
        public string CompanyLogin { get; set; }
    }
}
