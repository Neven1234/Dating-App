namespace udemyCourse.Dtos
{
    public class PhotoForCreationDTO
    {
        public string? Url { get; set; }
        public IFormFile File { get; set; }
        public string? Description { get; set; }
        public DateTime? DateAdd { get; set; }
        public string? PublicId { get; set; }
        public PhotoForCreationDTO()
        {
            DateAdd = DateTime.Now;
        }
    }
}
