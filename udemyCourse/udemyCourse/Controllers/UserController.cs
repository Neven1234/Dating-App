using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using udemyCourse.Data;
using udemyCourse.Dtos;

namespace udemyCourse.Controllers
{
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
        public async Task<IActionResult> GetUsers()
        {
            var users= await _datingRepository.GetAllAsync();
            var userListToReturn = _mapper.Map<IEnumerable<UserForListDTO>>(users);

            return Ok(userListToReturn);
        }
        [HttpGet("{id:int}")]
        public async Task <IActionResult> GetUser(int id)
        {
            var user=await _datingRepository.GetAsync(id);
            var userToREturn= _mapper.Map<UserForDetailsDTO>(user);
            return Ok(userToREturn);
        }
    }
}
