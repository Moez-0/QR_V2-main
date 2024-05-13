using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BCrypt.Net;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;

    public AuthController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] User user)
    {
        var existingUser = await _userService.GetUserByUsernameAsync(user.Username);
        if (existingUser != null)
        {
            return BadRequest("Username already exists");
        }

       string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
      
        user.Password = hashedPassword;
        Console.WriteLine(hashedPassword);

        await _userService.CreateUserAsync(user);
        return Ok("User registered successfully");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User user)
    {
        var existingUser = await _userService.GetUserByUsernameAsync(user.Username);
        if (existingUser == null || !BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password))
        {
            return BadRequest("Invalid username or password");
        }

        return Ok("Login successful");
    }
}
