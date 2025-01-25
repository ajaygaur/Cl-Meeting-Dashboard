namespace POC.Models
{
    public class Recording
    {
        public int ID {  get; set; }
        public int MeetingID {  get; set; }
        public string RecordingLink { get; set; } = string.Empty;   
        public int DownloadLink {  get; set; }
        public string TranscriptPath { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }= DateTime.Now;
        public DateTime ModifiedAt {  get; set; }= DateTime.Now;
    }
}
