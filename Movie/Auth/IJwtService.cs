using Movie.Models;

namespace Movie.Auth
{
    public interface IJwtService
    {
        string CreateToken(User user);
    }
}
