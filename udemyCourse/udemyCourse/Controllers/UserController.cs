using DomainLayer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using RepositoryLayer;
using System.Security.Claims;
using System.Text;
using udemyCourse.Dtos;


namespace udemyCourse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IRepository _repository;
        private readonly IConfiguration _configuration;

        public UserController(IRepository repository,IConfiguration configuration)
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
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Name,user.Username)
            };
            var key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
            var creds=new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);
            var TokenDescriptor = new SecurityTokenDescriptor
            {
                Subject=new ClaimsIdentity(claims),
                Expires=DateTime.Now.AddDays(3),
                SigningCredentials=creds
            };
            var tokenHandler = new JsonWebTokenHandler();
            var token = tokenHandler.CreateToken(TokenDescriptor);
            return Ok(new
            {
                token=token
            });
        }
    }
}
