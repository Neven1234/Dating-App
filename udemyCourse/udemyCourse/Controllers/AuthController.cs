
using AutoMapper;
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
        private readonly IMapper _mapper;

        public AuthController(IUserRepository repository, IMapper mapper)
        {
            _repository = repository;
            
            _mapper = mapper;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDTO userForRegisterDTO)
        {
            userForRegisterDTO.Username= userForRegisterDTO.Username.ToLower();
            if(await _repository.UserExist(userForRegisterDTO.Username))
            {
                return BadRequest("user already exist");
            }
            var userToCreate = _mapper.Map<User>(userForRegisterDTO);
        
            var createduser = await _repository.Register(userToCreate, userForRegisterDTO.Password);
            var userToReturn = _mapper.Map<UserForDetailsDTO>(createduser);
            return Ok(userToReturn);
        }

        //log in with google
        [HttpPost("googleLogin")]
        public async Task<IActionResult> LoginWithGoogle(LoginWithGoogleDTO googleDTO)
        {
            var result=await _repository.LoginWithGoogle(googleDTO);

            return Ok(result);
        }

        //registWithGoogle
        [HttpPost("googleRegister")]
        public async Task<IActionResult> RegisterByGoogle(RegisterWithGoogle registerWithGoogle)
        {
            var userToCreate = _mapper.Map<User>(registerWithGoogle);
            var CreatedUserAndToken=await _repository.RegisterByGoogle(userToCreate);
            return Ok(CreatedUserAndToken);
        }

        //log in
        [HttpPost("Login")]
        public async Task<IActionResult> LogIn(UserForLoginDTO userForLoginDTO)
        {
    
            var user=await _repository.Login(userForLoginDTO.Username, userForLoginDTO.Password);
            if (user==null)
            {
                return Unauthorized();
            }

            return Ok(user);

        }
      
    }
}
