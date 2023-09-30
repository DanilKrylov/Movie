using Movie.Models;

namespace Movie.Auth
{
    public class AuthService
    {
        private readonly Context _db;
        private readonly IJwtService _jwtService;

        public AuthService(IUserRepository db, IJwtService jwtService)
        {
            _db = db;
            _jwtService = jwtService;
        }
    }
}
