using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POC.Data;
using POC.Models;

namespace POC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActionItemController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public ActionItemController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost]
        public async Task<ActionResult<ActionItem>> AddActionItem(ActionItem actionItem)
        {
            if (actionItem == null)
                return BadRequest("ActionItem object is null");

            actionItem.CreatedAt = DateTime.Now;

            _appDbContext.actionitem.Add(actionItem);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetActionItemById), new { id = actionItem.ID }, actionItem);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActionItem>>> GetAllActionItems()
        {
            var actionItems = await _appDbContext.actionitem.ToListAsync();
            return Ok(actionItems);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActionItem>> GetActionItemById(int id)
        {
            var actionItem = await _appDbContext.actionitem.FindAsync(id);

            if (actionItem == null)
                return NotFound($"ActionItem with ID {id} not found");

            return Ok(actionItem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActionItem(int id, ActionItem updatedActionItem)
        {
            if (id != updatedActionItem.ID)
                return BadRequest("Mismatched ActionItem ID");

            var existingActionItem = await _appDbContext.actionitem.FindAsync(id);
            if (existingActionItem == null)
                return NotFound($"ActionItem with ID {id} not found");

            existingActionItem.RecordingID = updatedActionItem.RecordingID;
            existingActionItem.Description = updatedActionItem.Description;
            existingActionItem.AssignedTo = updatedActionItem.AssignedTo;
            existingActionItem.DueDate = updatedActionItem.DueDate;
            existingActionItem.Status = updatedActionItem.Status;

            try
            {
                await _appDbContext.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActionItemExists(id))
                    return NotFound();
                else
                    throw;
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActionItem(int id)
        {
            var actionItem = await _appDbContext.actionitem.FindAsync(id);
            if (actionItem == null)
                return NotFound($"ActionItem with ID {id} not found");

            _appDbContext.actionitem.Remove(actionItem);
            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool ActionItemExists(int id)
        {
            return _appDbContext.actionitem.Any(e => e.ID == id);
        }
    }
}
