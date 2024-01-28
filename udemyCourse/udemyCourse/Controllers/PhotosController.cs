﻿using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using udemyCourse.Data;
using udemyCourse.Dtos;
using udemyCourse.Helpers;
using udemyCourse.Models;

namespace udemyCourse.Controllers
{
    [Authorize]
    [Route("api/User/{userId}/[controller]")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfi;
        private Cloudinary _Cloudinary;

        public PhotosController(IDatingRepository repository,IMapper mapper,IOptions<CloudinarySettings>CloudinaryConfi )
        {
            _repository = repository;
            _mapper = mapper;
            _cloudinaryConfi = CloudinaryConfi;

            Account account = new Account(
                _cloudinaryConfi.Value.CloudName,
                _cloudinaryConfi.Value.ApiKey,
                _cloudinaryConfi.Value.ApiSecret
                );
            _Cloudinary = new Cloudinary( account );
        }
        [HttpGet("{id}",Name ="GetPhoto")]
        public async Task<IActionResult>GetPhoto (int id)
        {
            var photoFromRepo = await _repository.GetPhotoAsynk(id);
            var photo= _mapper.Map<PhotoForReturnDTO>( photoFromRepo );   
            return Ok( photo );
        }
        [HttpPost]
        public async Task<IActionResult>AddPhotoForUser(int userId,[FromForm]PhotoForCreationDTO photoForCreationDTO)
        {
            if (userId != int.Parse(User.FindFirstValue("userId")))
            {
                return Unauthorized();
            }
            var userFromRepo = await _repository.GetAsync(userId);
            var file=photoForCreationDTO.File;
            var UploadResolt = new ImageUploadResult();
            if(file.Length>0)
            {
                using (var stram=file.OpenReadStream())
                {

                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stram),
                       // PublicId = "test",
                        //if user upload long photo we will focus on the face to make the image square
                        Transformation = new Transformation().Gravity("face").Height(200).Width(200).Crop("thumb").Chain()
                       .Radius("max").Chain()
                       
                    };
                    UploadResolt=_Cloudinary.Upload(uploadParams);

                }
            }
            photoForCreationDTO.Url = UploadResolt.Url.ToString();
            photoForCreationDTO.PublicId = UploadResolt.PublicId;
            //mapping
            var photo = _mapper.Map<Photo>(photoForCreationDTO);
            var flag = userFromRepo.Photos.Any(u => u.IsMain);
            if (!flag)
            {
                photo.IsMain = true;
            }
            userFromRepo.Photos.Add(photo);
            
            if(await _repository.SaveAll())
            {
                var photoToreturn = _mapper.Map<PhotoForReturnDTO>(photo);
                var routerValues = new { id = photoToreturn.Id };

                return Ok(photoToreturn.Id);
            }
            return BadRequest("Could not add the photo");
        }
    }
}