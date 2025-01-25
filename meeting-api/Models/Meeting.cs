namespace POC.Models
{
    public class Meeting
    {
        public int ID   { get; set; }
        public int AccountID { get; set; }
        public string MeetingTitle { get; set; }=  string.Empty;
        public DateTime MeetingDate { get; set; }
        public int Duration { get; set; }
        public string MeetingStatus { get; set; } = string.Empty;
        public string VenueAddress { get; set; } = string.Empty;
        public string Organizer { get; set; } = string.Empty;
        public string Speaker { get; set; } = string.Empty;
        public string Attendees { get; set; } = string.Empty;
        public string JoiningLink { get; set; } = string.Empty;
        public string ServiceProvider { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }= DateTime.Now;
        public DateTime modifiedAt { get; set; } = DateTime.Now;
    }
}
