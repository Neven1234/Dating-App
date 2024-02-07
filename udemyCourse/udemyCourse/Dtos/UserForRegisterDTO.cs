using System.ComponentModel.DataAnnotations;

namespace udemyCourse.Dtos
{
    public class UserForRegisterDTO
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(10 ,MinimumLength=8,ErrorMessage ="you must specify password between 10 to 8 characters")]
        public string Password { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set;}
        [Required]
        public string City { get; set;}
        [Required]
        public string Country { get; set;}
        public DateTime Created { get; set;}
        public DateTime LastActive { get; set;}
        public UserForRegisterDTO()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }

    }
}
