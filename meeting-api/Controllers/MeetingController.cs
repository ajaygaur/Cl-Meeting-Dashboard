using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POC.Data;
using POC.Models;

namespace POC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        public MeetingController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }


        [HttpPost]
        public async Task<ActionResult<Meeting>> AddMeeting(Meeting meeting)
        {
            if (meeting == null)
                return BadRequest("Meeting object is null");

            meeting.CreatedAt = DateTime.Now;
            meeting.ModifiedAt = DateTime.Now;

            _appDbContext.meeting.Add(meeting);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMeetingById), new { id = meeting.ID }, meeting);
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Meeting>>> GetAllMeetings()
        {
            var meetings = await _appDbContext.meeting.ToListAsync();
            return Ok(meetings);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Meeting>> GetMeetingById(int id)
        {
            var meeting = await _appDbContext.meeting.FindAsync(id);

            if (meeting == null)
                return NotFound($"Meeting with ID {id} not found");

            return Ok(meeting);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMeeting(int id, Meeting updatedMeeting)
        {
            if (updatedMeeting == null)
                return BadRequest("Invalid Meeting Data");

            var existingMeeting = await _appDbContext.meeting.FindAsync(id);
            if (existingMeeting == null)
                return NotFound($"Meeting with ID {id} not found");


            if (updatedMeeting.AccountID != null)
                existingMeeting.AccountID = updatedMeeting.AccountID;

            if (!string.IsNullOrEmpty(updatedMeeting.MeetingTitle))
                existingMeeting.MeetingTitle = updatedMeeting.MeetingTitle;

            if (updatedMeeting.MeetingDate != null)
                existingMeeting.MeetingDate = updatedMeeting.MeetingDate;

            if (updatedMeeting.Duration != null)
                existingMeeting.Duration = updatedMeeting.Duration;

            if (updatedMeeting.MeetingStatus != null)
                existingMeeting.MeetingStatus = updatedMeeting.MeetingStatus;

            if (!string.IsNullOrEmpty(updatedMeeting.VenueAddress))
                existingMeeting.VenueAddress = updatedMeeting.VenueAddress;

            if (!string.IsNullOrEmpty(updatedMeeting.Organizer))
                existingMeeting.Organizer = updatedMeeting.Organizer;

            if (!string.IsNullOrEmpty(updatedMeeting.Speaker))
                existingMeeting.Speaker = updatedMeeting.Speaker;

            if (updatedMeeting.Attendees != null)
                existingMeeting.Attendees = updatedMeeting.Attendees;

            if (!string.IsNullOrEmpty(updatedMeeting.JoiningLink))
                existingMeeting.JoiningLink = updatedMeeting.JoiningLink;

            if (!string.IsNullOrEmpty(updatedMeeting.ServiceProvider))
                existingMeeting.ServiceProvider = updatedMeeting.ServiceProvider;

            existingMeeting.ModifiedAt = DateTime.Now;  // Always update the modified timestamp


            try
            {
                await _appDbContext.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MeetingExists(id))
                    return NotFound();
                else
                    throw;
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMeeting(int id)
        {
            var meeting = await _appDbContext.meeting.FindAsync(id);
            if (meeting == null)
                return NotFound($"Meeting with ID {id} not found");

            _appDbContext.meeting.Remove(meeting);
            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool MeetingExists(int id)
        {
            return _appDbContext.meeting.Any(e => e.ID == id);
        }
    }
}
