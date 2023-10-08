using Movie.Models;

namespace Movie.Auth
{
    public class AuthService : IAuthService
    {
        private readonly Context _db;
        private readonly IJwtService _jwtService;

        public AuthService(Context db, IJwtService jwtService)
        {
            _db = db;
            _jwtService = jwtService;
        }

        public AuthorizeOperationResult Login(string login, string password)
        {
            if (!_db.Users.Any(c => c.Login == login && c.Password == password))
            {
                var res = new AuthorizeOperationResult(false);
                res.AddError("password", "password or email enterd incorectly");
                return res;
            }

            var user = _db.Users.Find(login);

            var token = _jwtService.CreateToken(user);
            return new AuthorizeOperationResult(true, token);
        }
    }
}
