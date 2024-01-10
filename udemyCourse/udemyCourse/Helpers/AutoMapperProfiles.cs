using AutoMapper;
using udemyCourse.Dtos;
using udemyCourse.Models;

namespace udemyCourse.Helpers
{
    public class AutoMapperProfiles:Profile
    {
        public AutoMapperProfiles() 
        { 
            CreateMap<User,UserForDetailsDTO>();
            CreateMap<User,UserForListDTO>();
        }
    }
}
