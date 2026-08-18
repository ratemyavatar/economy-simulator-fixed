using Microsoft.AspNetCore.Mvc;

namespace Roblox.Website.Controllers
{
    [ApiController]
    [Route("/")]
    public class RccClientSettingsController : ControllerBase
    {
        [HttpGet("/Setting/QuietGet/{appName}")]
        [HttpGet("/Setting/QuietGet/{appName}/")]
        [HttpGetBypass("/Setting/QuietGet/{appName}")]
        [HttpGetBypass("/Setting/QuietGet/{appName}/")]
        public IActionResult QuietGetByName(string appName)
        {
            return Ok(new Dictionary<string, object>
            {
                { "FlagsLoaded", true }
            });
        }

        [HttpGet("/GetAllowedSecurityVersions")]
        [HttpGet("/GetAllowedSecurityVersions/")]
        [HttpGetBypass("/GetAllowedSecurityVersions")]
        [HttpGetBypass("/GetAllowedSecurityVersions/")]
        public IActionResult GetAllowedSecurityVersions()
        {
            return Ok(new { data = Array.Empty<string>() });
        }

        [HttpGet("/GetAllowedMD5Hashes")]
        [HttpGet("/GetAllowedMD5Hashes/")]
        [HttpGetBypass("/GetAllowedMD5Hashes")]
        [HttpGetBypass("/GetAllowedMD5Hashes/")]
        public IActionResult GetAllowedMd5Hashes()
        {
            return Ok(new { data = Array.Empty<string>() });
        }
    }
}
