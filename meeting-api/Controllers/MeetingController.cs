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
            meeting.modifiedAt = DateTime.Now;

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
            if (id != updatedMeeting.ID)
                return BadRequest("Mismatched meeting ID");

            var existingMeeting = await _appDbContext.meeting.FindAsync(id);
            if (existingMeeting == null)
                return NotFound($"Meeting with ID {id} not found");


            existingMeeting.AccountID = updatedMeeting.AccountID;
            existingMeeting.MeetingTitle = updatedMeeting.MeetingTitle;
            existingMeeting.MeetingDate = updatedMeeting.MeetingDate;
            existingMeeting.Duration = updatedMeeting.Duration;
            existingMeeting.MeetingStatus = updatedMeeting.MeetingStatus;
            existingMeeting.VenueAddress = updatedMeeting.VenueAddress;
            existingMeeting.Organizer = updatedMeeting.Organizer;
            existingMeeting.Speaker = updatedMeeting.Speaker;
            existingMeeting.Attendees = updatedMeeting.Attendees;
            existingMeeting.JoiningLink = updatedMeeting.JoiningLink;
            existingMeeting.ServiceProvider = updatedMeeting.ServiceProvider;
            existingMeeting.modifiedAt = DateTime.Now;

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
