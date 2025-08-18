using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlanDayAPI.Data;

namespace PlanDayAPI.Controllers;

[Route("events")]
public class EventsController : ControllerBase
{
    private readonly AppDbContext _context;

    public EventsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetEvents([FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        if (start == default || end == default || start >= end)
            return BadRequest("start and end dates must be valid and start must be before end");

        var events = await _context.Events
            .Where(x => x.Date >= start && x.Date <= end)
            .ToListAsync();

        return Ok(new { success = true, data = events });
    }
}