using Microsoft.AspNetCore.Mvc;

namespace planday_api_temp.Controllers;

[ApiController]
[Route("/ok")]

public class OkController : ControllerBase
{
    [HttpGet]
    public IActionResult GetOk()
    {
        return Ok(new { Message = "Ok" });
    }
}