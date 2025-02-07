using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POC.Data;
using POC.Models;

namespace POC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        public AccountController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }


        [HttpPost]
        public async Task<ActionResult<Account>> AddAccount(Account Account)
        {
            if (Account == null)
                return BadRequest("Account object is null");

            Account.CreatedAt = DateTime.Now;
            Account.ModifiedAt = DateTime.Now;

            _appDbContext.account.Add(Account);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAccountById), new { id = Account.ID }, Account);
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Account>>> GetAllAccounts()
        {
            var Accounts = await _appDbContext.account.ToListAsync();
            return Ok(Accounts);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Account>> GetAccountById(int id)
        {
            var Account = await _appDbContext.account.FindAsync(id);

            if (Account == null)
                return NotFound($"Account with ID {id} not found");

            return Ok(Account);
        }

        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdateAccount(int id, Account updatedAccount)
        //{
        //    if (id != updatedAccount.ID)
        //        return BadRequest("Mismatched Account ID");

        //    var existingAccount = await _appDbContext.account.FindAsync(id);
        //    if (existingAccount == null)
        //        return NotFound($"Account with ID {id} not found");


        //    existingAccount.AccountID = updatedAccount.AccountID;
        //    existingAccount.AccountTitle = updatedAccount.AccountTitle;
        //    existingAccount.AccountDate = updatedAccount.AccountDate;
        //    existingAccount.Duration = updatedAccount.Duration;
        //    existingAccount.AccountStatus = updatedAccount.AccountStatus;
        //    existingAccount.VenueAddress = updatedAccount.VenueAddress;
        //    existingAccount.Organizer = updatedAccount.Organizer;
        //    existingAccount.Speaker = updatedAccount.Speaker;
        //    existingAccount.Attendees = updatedAccount.Attendees;
        //    existingAccount.JoiningLink = updatedAccount.JoiningLink;
        //    existingAccount.ServiceProvider = updatedAccount.ServiceProvider;
        //    existingAccount.modifiedAt = DateTime.Now;

        //    try
        //    {
        //        await _appDbContext.SaveChangesAsync();
        //        return NoContent();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!AccountExists(id))
        //            return NotFound();
        //        else
        //            throw;
        //    }
        //}

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteAccount(int id)
        //{
        //    var Account = await _appDbContext.Account.FindAsync(id);
        //    if (Account == null)
        //        return NotFound($"Account with ID {id} not found");

        //    _appDbContext.Account.Remove(Account);
        //    await _appDbContext.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool AccountExists(int id)
        {
            return _appDbContext.account.Any(e => e.ID == id);
        }
    }
}
