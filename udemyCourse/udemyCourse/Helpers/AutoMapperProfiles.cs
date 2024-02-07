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
        }
    }
}
