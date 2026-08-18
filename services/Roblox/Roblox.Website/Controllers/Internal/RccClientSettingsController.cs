using Microsoft.AspNetCore.Mvc;

namespace Roblox.Website.Controllers
{
    [ApiController]
    [Route("/")]
    public class RccClientSettingsController : ControllerBase
    {
        [HttpGetBypass("/Setting/QuietGet/{appName}")]
        [HttpGetBypass("/Setting/QuietGet/{appName}/")]
        public Dictionary<string, object> QuietGetByName(string appName, string? apiKey = null)
        {
            return new Dictionary<string, object>
            {
                { "FlagsLoaded", true }
            };
        }

        [HttpGetBypass("/GetAllowedSecurityVersions")]
        [HttpGetBypass("/GetAllowedSecurityVersions/")]
        public object GetAllowedSecurityVersions(string? apiKey = null)
        {
            return new { data = Array.Empty<string>() };
        }

        [HttpGetBypass("/GetAllowedMD5Hashes")]
        [HttpGetBypass("/GetAllowedMD5Hashes/")]
        public object GetAllowedMd5Hashes(string? apiKey = null)
        {
            return new { data = Array.Empty<string>() };
        }
    }
}
