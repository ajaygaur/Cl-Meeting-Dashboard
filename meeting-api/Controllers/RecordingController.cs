using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POC.Data;
using POC.Models;

namespace POC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordingController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public RecordingController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost]
        public async Task<ActionResult<Recording>> AddRecording(Recording recording)
        {
            if (recording == null)
                return BadRequest("Recording object is null");

            recording.CreatedAt = DateTime.Now;
            recording.ModifiedAt = DateTime.Now;

            _appDbContext.recording.Add(recording);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRecordingById), new { id = recording.ID }, recording);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recording>>> GetAllRecordings()
        {
            var recordings = await _appDbContext.recording.ToListAsync();
            return Ok(recordings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Recording>> GetRecordingById(int id)
        {
            var recording = await _appDbContext.recording.FindAsync(id);

            if (recording == null)
                return NotFound($"Recording with ID {id} not found");

            return Ok(recording);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecording(int id, Recording updatedRecording)
        {
            if (id != updatedRecording.ID)
                return BadRequest("Mismatched Recording ID");

            var existingRecording = await _appDbContext.recording.FindAsync(id);
            if (existingRecording == null)
                return NotFound($"Recording with ID {id} not found");

            existingRecording.MeetingID = updatedRecording.MeetingID;
            existingRecording.RecordingLink = updatedRecording.RecordingLink;
            existingRecording.DownloadLink = updatedRecording.DownloadLink;
            existingRecording.TranscriptPath = updatedRecording.TranscriptPath;
            existingRecording.Status = updatedRecording.Status;
            existingRecording.ModifiedAt = DateTime.Now;

            try
            {
                await _appDbContext.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecordingExists(id))
                    return NotFound();
                else
                    throw;
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecording(int id)
        {
            var recording = await _appDbContext.recording.FindAsync(id);
            if (recording == null)
                return NotFound($"Recording with ID {id} not found");

            _appDbContext.recording.Remove(recording);
            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool RecordingExists(int id)
        {
            return _appDbContext.recording.Any(e => e.ID == id);
        }
    }
}
