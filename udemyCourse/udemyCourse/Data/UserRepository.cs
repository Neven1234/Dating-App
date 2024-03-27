
using AutoMapper;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using udemyCourse;
using udemyCourse.Dtos;
using udemyCourse.Models;

namespace udemyCourse
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public UserRepository(AppDbContext dbContext, IConfiguration configuration, IMapper mapper)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _mapper = mapper;
        }
        public async Task<object> Login(string username, string password)
        {
            var user = await _dbContext.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Username == username);

            if(user == null)
            {
                return null;
            }
            if(!VerifayPassword(password,user.PasswordSalt,user.PasswordHash))
            {
                return null;
            }
            var userToReturn = _mapper.Map<UserForDetailsDTO>(user);
            var authClaims = new List<Claim>
            {
                new Claim("name",user.Username),
                new Claim("userId",user.Id.ToString()),

                new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
            };
            var jwtToken = getToken(authClaims);
            var token = new JwtSecurityTokenHandler().WriteToken(jwtToken);
            var expiration = DateTime.Now.AddDays(3);
            return (new
            {
                token = token,
                user = userToReturn
            });

           
        }

        private bool VerifayPassword(string password, byte[] passwordSalt, byte[] passwordHash)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for(int i=0;i<computedHash.Length;i++)
                {
                    if (computedHash[i] != passwordHash[i])
                        return false;
                }
            }
            return true;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] PasswordHash, PasswordSalt;
            CreatePasswordHash(password, out PasswordHash, out PasswordSalt);
            user.PasswordHash = PasswordHash;
            user.PasswordSalt = PasswordSalt;
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash=hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        
        }

        public async Task<bool> UserExist(string username)
        {
           if(await _dbContext.Users.AnyAsync(x=> x.Username == username))
                return true;
           return false;
        }

        public async Task<Object> LoginWithGoogle(LoginWithGoogleDTO googleDTO)
        {
            var settings  = new  GoogleJsonWebSignature.ValidationSettings
            {
                Audience=  new  List<string>() { "41236342619-pah3dkvkj2gq3ligp8gbjv9ido6jftvc.apps.googleusercontent.com" }
            };

            try
            {
                var user = await GoogleJsonWebSignature.ValidateAsync(googleDTO.IdToken, settings);
                
                    if (await UserExist(user.GivenName))
                    {
                        var userExist = await _dbContext.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Username == user.GivenName);
                        var userToReturn = _mapper.Map<UserForDetailsDTO>(userExist);
                        var authClaims = new List<Claim>
                        {
                            new Claim("name",userExist.Username),
                            new Claim("userId",userExist.Id.ToString()),

                            new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
                        };
                        var jwtToken = getToken(authClaims);
                        var token = new JwtSecurityTokenHandler().WriteToken(jwtToken);
                        var expiration = DateTime.Now.AddDays(3);
                        return (new
                        {
                            token = token,
                            user = userToReturn
                        });

                    }
                    else
                    {

                        return (new
                        {
                            NewUser = user,
                            register = true
                        });
                    }

            }
            catch
            {
                return null;
            }




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

        public async Task<object> RegisterByGoogle(User Newuser)
        {
            try
            {
                await _dbContext.Users.AddAsync(Newuser);
                await _dbContext.SaveChangesAsync();
                var authClaims = new List<Claim>
                {
                    new Claim("name",Newuser.Username),
                    new Claim("userId",Newuser.Id.ToString()),

                    new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
                };
                var jwtToken = getToken(authClaims);
                var token = new JwtSecurityTokenHandler().WriteToken(jwtToken);
                var expiration = DateTime.Now.AddDays(3);
                return (new
                {
                    token = token,
                    user = Newuser
                });
            }
            catch 
            {
                return null;
            }
        }
    }
}
