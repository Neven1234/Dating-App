using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using udemyCourse.Data;
using udemyCourse.Dtos;
using udemyCourse.Helpers;
using udemyCourse.Models;

namespace udemyCourse.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;

        public MessagesController(IDatingRepository repository,IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet("{id}",Name ="GetMessages")]
        public async Task<IActionResult> GetMessage(int id,int userId)
        {
            if (userId != int.Parse(User.FindFirstValue("userId")))
            {
                return Unauthorized();
            }
            var messageFroRepo = await _repository.GetMessage(id);
            if(messageFroRepo == null)
            {
                return NotFound();
            }
            var messageToReturn = _mapper.Map<MessageForCreartionDTO>(messageFroRepo);
            return Ok(messageToReturn);
        }

        [HttpGet]
        public async Task<IActionResult>GetMessgesForUser(int userId,[FromQuery]MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirstValue("userId")))
            {
                return Unauthorized();
            }
            messageParams.UserId = userId;
            var messagesForRepo = await _repository.GetMessagesForUser(messageParams);
            var messages=_mapper.Map<IEnumerable<MessageToReturnDTO>>(messagesForRepo);
            Response.AddPagination(messagesForRepo.CurentPage, messagesForRepo.PageSize
                , messagesForRepo.TotalCount, messagesForRepo.TotalPages);

            return Ok(messages);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId,int recipientId)
        {
            if (userId != int.Parse(User.FindFirstValue("userId")))
            {
                return Unauthorized();
            }
            var messagesFromRepo=await _repository.GetMessageTread(userId, recipientId);
            var messagesThread = _mapper.Map<IEnumerable<MessageToReturnDTO>>(messagesFromRepo);
            return Ok(messagesThread);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId,MessageForCreartionDTO messageForCreartionDTO)
        {

            if (userId != int.Parse(User.FindFirstValue("userId")))
            {
                return Unauthorized();
            }
            messageForCreartionDTO.SenderId = userId;
            var recipient = await _repository.GetAsync(messageForCreartionDTO.RecipientId);
            if(recipient == null)
            {
                return BadRequest("Could not find user");
            }
            var message = _mapper.Map<Message>(messageForCreartionDTO);
            _repository.Add(message);
           
            if(await _repository.SaveAll())
            {
                var messageToReturn = _mapper.Map<MessageForCreartionDTO>(message);
                return Ok(messageToReturn);
            }
            return BadRequest("Couldnt sent Message");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletMessage(int id,int userId)
        {
            if (userId != int.Parse(User.FindFirstValue("userId")))
            {
                return Unauthorized();
            }
            var messageFromRepo = await _repository.GetMessage(id);
            if(messageFromRepo.SenderId==userId)
            {
                messageFromRepo.SenderDeleted = true;

            }
            if(messageFromRepo.RecipientId==userId)
            {
                messageFromRepo.RecipientDeleted = true;
                return Ok();
            }
            if(messageFromRepo.SenderDeleted == true)
            {
                _repository.Delete(messageFromRepo);
                if(await _repository.SaveAll())
                {
                    return Ok();
                }
               

            }
            return BadRequest();

        }
        [HttpPost("{id}/Seen")]
        public async Task<IActionResult>SeenMessage(int id,int userId)
        {
            var message = await _repository.GetMessage(id);
            if (message.RecipientId != userId){
                return Unauthorized();
            }
            message.IsRead=true;    
            message.DateRead  = DateTime.Now;
            await _repository.SaveAll();
            return Ok();
        }
    }
}
