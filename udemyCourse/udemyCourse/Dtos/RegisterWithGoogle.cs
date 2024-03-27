using System.ComponentModel.DataAnnotations;

namespace udemyCourse.Dtos
{
    public class RegisterWithGoogle
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public RegisterWithGoogle()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}
