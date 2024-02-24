namespace udemyCourse.Dtos
{
    public class MessageForCreartionDTO
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public DateTime MessageSent { get; set;}
        public string Content { get; set;}
        public MessageForCreartionDTO()
        {
            MessageSent = DateTime.Now;
        }

    }
}
