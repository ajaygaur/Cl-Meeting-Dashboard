namespace POC.Models
{
    public class Account
    {
        public int ID {  get; set; }
        public string GpNumber {  get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string AccountType {  get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }= DateTime.Now;
        public DateTime ModifiedAt {  get; set; }= DateTime.Now;
    }
}
