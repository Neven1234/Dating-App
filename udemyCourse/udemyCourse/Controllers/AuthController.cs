
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using udemyCourse.Dtos;
using udemyCourse.Models;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace udemyCourse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _repository;
        private readonly IConfiguration _configuration;

        public AuthController(IUserRepository repository,IConfiguration configuration)
        {
            this._repository = repository;
            this._configuration = configuration;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDTO userForRegisterDTO)
        {
            userForRegisterDTO.Username= userForRegisterDTO.Username.ToLower();
            if(await _repository.UserExist(userForRegisterDTO.Username))
            {
                return BadRequest("user already exist");
            }
            var userToCreate = new User
            {
                Username = userForRegisterDTO.Username
            };
            var createduser = await _repository.Register(userToCreate, userForRegisterDTO.Password);
            return StatusCode(201);
        }

        //log in
        [HttpPost("Login")]
        public async Task<IActionResult> LogIn(UserForLoginDTO userForLoginDTO)
        {
    
            var user=await _repository.Login(userForLoginDTO.Username, userForLoginDTO.Password);
            if(user==null)
            {
                return Unauthorized();
            }
            var authClaims = new List<Claim>
            {
                new Claim("name",user.Username),
                new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
            };
            var jwtToken = getToken(authClaims);
            var token = new JwtSecurityTokenHandler().WriteToken(jwtToken);
            var expiration = DateTime.Now.AddDays(3);
            return Ok(new
            {
                token = token
            });

        }
        //helper functions

        private JwtSecurityToken getToken(List<Claim> authClims)
        {
            var authSigninKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this._configuration["JWT:Secret"]));
            var token = new JwtSecurityToken(
                issuer: this._configuration["JWT:ValidIssuer"],
                audience: this._configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClims,
                signingCredentials: new SigningCredentials(authSigninKey, SecurityAlgorithms.HmacSha256)
                );
            return token;

        }
    }
}
