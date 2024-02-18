namespace udemyCourse.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize=10;
        public int PageSize 
        {
            get { return pageSize ; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; } 
        }

        //user filter
        public int UserId { get; set; }
        public string? Gender { get; set; }
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 90;
        public string OrderBy { get; set; } = "lastActive";

        //Like
        public bool Likees { get; set; }
        public bool Likers { get; set; }
    }
}
