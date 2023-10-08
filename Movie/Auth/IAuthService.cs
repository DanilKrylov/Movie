namespace Movie.Auth
{
    public interface IAuthService
    {
        public AuthorizeOperationResult Login(string username, string password);
    }
}
