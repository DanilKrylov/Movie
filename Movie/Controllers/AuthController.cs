﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movie.Auth;
using Movie.Models;

namespace Movie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        private readonly Context _context;

        public AuthController(IAuthService authService, Context context)
        {
            _authService = authService;
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginViewModel viewModel)
        {
            return Ok(_authService.Login(viewModel.Login, viewModel.Password));
        }

        [HttpPost("registerCinema")]
        public async Task<ActionResult> Register([FromBody] RegisterViewModel registerModel)
        {
            _context.Companies.Add(new Company
            {
                Name = registerModel.Name,
                Login = registerModel.Login,
                Address = registerModel.Address,
                Password = registerModel.Password,
            });

            _context.SaveChanges();

            return Ok(_authService.Login(registerModel.Login, registerModel.Password));
        }

        [Authorize]
        [HttpPost("checkSignIn")]
        public IActionResult Check()
        {
            return Ok();
        }

        public class RegisterViewModel
        {
            public string Login { get; set; }
            public string Password { get; set; }
            public string Name { get; set; }
            public string Address { get; set; }
        }

        public class LoginViewModel
        {
            public string Login { get; set; }

            public string Password { get; set; }
        }
    }
}
