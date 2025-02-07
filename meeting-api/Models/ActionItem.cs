namespace POC.Models
{
    public class ActionItem
    {
        public int ID { get; set; }
        public int RecordingID { get; set; }
        public string Description { get; set; }=string.Empty;
        public string AssignedTo { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }=DateTime.Now;
        public string Status {  get; set; } = string.Empty;
        public DateTime CreatedAt {  get; set; }=DateTime.Now;
    }
}
