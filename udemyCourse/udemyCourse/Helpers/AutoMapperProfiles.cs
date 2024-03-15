using AutoMapper;
using udemyCourse.Dtos;
using udemyCourse.Models;

namespace udemyCourse.Helpers
{
    public class AutoMapperProfiles:Profile
    {
        public AutoMapperProfiles() 
        { 
            CreateMap<User,UserForDetailsDTO>()
                .ForMember(des => des.PhotoUrl, opt => opt.MapFrom(src =>
                     src.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(des => des.Age, opt => opt.MapFrom(src =>
                    src.DateOfBirth.CalculateAge()));

            CreateMap<User, UserForListDTO>()
                .ForMember(des => des.PhotoUrl, opt => opt.MapFrom(src =>
                     src.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(des => des.Age, opt => opt.MapFrom(src =>
                    src.DateOfBirth.CalculateAge()));


            CreateMap<UserForUpdateDTO, User>();

            CreateMap<Photo, PhotoForReturnDTO>();

            CreateMap<PhotoForCreationDTO, Photo>();

            CreateMap<UserForRegisterDTO, User>();

            CreateMap<MessageForCreartionDTO, Message>().ReverseMap();

            CreateMap<Message, MessageToReturnDTO>()
                .ForMember(m => m.SenderPhotoUrl, opt => opt
                .MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(m => m.RecipienPhotoUrl, opt => opt
                .MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));


            
        }
    }
}
