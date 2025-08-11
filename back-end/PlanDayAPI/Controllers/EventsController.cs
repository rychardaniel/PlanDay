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
    public async Task<IActionResult> GetEvents()
    {
        var events = await _context.Events.ToListAsync();
        return Ok(new { success = true, data = events });
    }
}