using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using udemyCourse.Data;
using udemyCourse.Dtos;
using udemyCourse.Helpers;

namespace udemyCourse.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;

        public UserController(IDatingRepository datingRepository,IMapper mapper)
        {
            _datingRepository = datingRepository;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {        
            userParams.UserId = int.Parse(User.FindFirstValue("userId"));
            var users= await _datingRepository.GetAllAsync(userParams);
            var userListToReturn = _mapper.Map<IEnumerable<UserForListDTO>>(users);
            Response.AddPagination(users.CurentPage, users.PageSize,users.TotalCount,users.TotalPages);
            return Ok(userListToReturn);
        } 
        [HttpGet("{id:int}")]
        public async Task <IActionResult> GetUser(int id)
        {
            var user=await _datingRepository.GetAsync(id);
            var userToREturn= _mapper.Map<UserForDetailsDTO>(user);
            return Ok(userToREturn);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateUser(int id,UserForUpdateDTO userForUpdateDTO)
        {
            if (id != int.Parse(User.FindFirstValue("userId")))
            {
                return Unauthorized();
            }
            var userFromRepo = await _datingRepository.GetAsync(id);
            _mapper.Map(userForUpdateDTO, userFromRepo);
            if(await _datingRepository.SaveAll())
            {
                return NoContent();
            }
            throw new Exception($"Updating user {id} failed on save");
        }
    }
}
