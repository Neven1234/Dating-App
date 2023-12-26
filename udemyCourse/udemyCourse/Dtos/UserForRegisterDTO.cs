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
    }
}
