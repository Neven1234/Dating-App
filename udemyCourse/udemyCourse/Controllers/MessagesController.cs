using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
        private readonly HubService _hubService;
      

        public MessagesController(IDatingRepository repository,IMapper mapper,HubService hubService)
        {
            _repository = repository;
            _mapper = mapper;
           _hubService = hubService;
            
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

        [HttpGet("thread/")]
        public async Task<IActionResult> GetMessageThread([FromQuery] UserParams userParams)
        {
            if (userParams.UserId!= int.Parse(User.FindFirstValue("userId")))
            {
                return Unauthorized();
            }
            var messagesFromRepo=await _repository.GetMessageTread(userParams);
            var messagesThread = _mapper.Map<IEnumerable<MessageToReturnDTO>>(messagesFromRepo);
            return Ok(messagesThread.OrderBy(m=>m.Id));
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
            var messageToReturn = _mapper.Map<MessageToReturnDTO>(message);
            var mainPhoto = await _repository.GetMainPhoto(userId);
            messageToReturn.SenderPhotoUrl = mainPhoto.Url;
            if (await _repository.SaveAll())
            {
                await _hubService.SendMessageToGroup(messageToReturn.SenderId.ToString(),messageToReturn.RecipientId.ToString(), messageToReturn);
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
            //if (message.RecipientId != userId){
            //    return Unauthorized();
            //}
            message.IsRead=true;    
            message.DateRead  = DateTime.Now;
            await _repository.SaveAll();
            return Ok();
        }
    }
}
