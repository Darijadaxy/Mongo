using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebTemplate.DTOs;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("createUser")]
    public async Task<ActionResult<User>> CreateUser([FromBody] CreateUserDTO userDTO) //umesto nje ide register!
    {
        try
        {
            var user = await _userService.CreateAsync(userDTO);
            return Ok(user);

        }
        catch (Exception ex)
        {
            return BadRequest($"Invalid data: {ex.Message}");
        }
    }

    [HttpGet("getAllUsers"), Authorize(Roles = "admin")]
    public async Task<ActionResult<UserInfoDTO>> GetAllUsers()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("getUserById/{id}"), Authorize(Roles = "admin")]
    public async Task<ActionResult<UserInfoDTO>> GetUserById(string id)
    {
        var user = await _userService.GetByIdAsync(id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpGet("getUser"), Authorize(Roles = "user")]
    public async Task<ActionResult<UserInfoDTO>> getUser()
    {

        var user = await _userService.GetLoggedInUserInfoAsync();

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPut("updateUser/{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDTO dto)
    {
        var success = await _userService.UpdateAsync(id, dto);

        if (!success)
            return NotFound("User not found or no fields to update.");

        return Ok("User successfully updated!");
    }

    [HttpPut("updateUser"), Authorize(Roles = "user")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDTO dto)
    {
        var success = await _userService.UpdateAsync(dto);

        if (!success)
            return NotFound("User not found or no fields to update.");

        return Ok("User successfully updated!");
    }

    [HttpDelete("deleteUser/{id}"), Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var deleted = await _userService.DeleteAsync(id);

        if (!deleted)
            return NotFound("User not found.");

        return Ok("User deleted successfully");
    }
    
    [HttpDelete("deleteProfile"), Authorize(Roles = "user")]
    public async Task<IActionResult> DeleteProfile()
    {
        var deleted = await _userService.DeleteProfile(); 

        if (!deleted)
            return BadRequest(" nije moguce izbrisati profil");

        return Ok("profil uspesno obrisan");
    }



    [HttpPut("saveTrip/{tripId}"), Authorize(Roles = "user")]
    public async Task<IActionResult> SaveTrip(string tripId)
    {
        var success = await _userService.SaveTrip(tripId);
        if (!success)
            return BadRequest("Neuspešno čuvanje putovanja.");

        return Ok("Putovanje je sačuvano.");
    }
    [HttpGet("getSavedTrips"), Authorize(Roles = "user")]
    public async Task<ActionResult<SavedTripDTO>> GetSavedTips()
    {
        var savedTrips = await _userService.GetSavedTrips();
        return Ok(savedTrips);
    }

    [HttpPost]
    [Route("registerUser")]
    public async Task<ActionResult> RegisterUser([FromBody] CreateUserDTO userDTO)
    {
        if (userDTO == null)
        {
            return BadRequest("Invalid data input.");
        }

        try
        {
            var user = await _userService.CreateAsync(userDTO);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest($"Invalid data: {ex.Message}");
        }
    }

    [HttpPost("logInUser")]
    public async Task<IActionResult> LogInUser([FromBody] LogInDTO dto)
    {
        try
        {
            var token = await _userService.LogInAsync(dto);

            if (token == null)
                return Unauthorized("Wrong username or password.");

            Response.ContentType = "text/plain";

            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddHours(1)
            });

            return Ok(token);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    [HttpPost("logOutUser"), Authorize(Roles = "user")]
    public IActionResult LogOutUser()
    {
        Response.Cookies.Delete("jwt");
        return Ok(new
        {
            message = "success"
        });
    }

    [HttpGet("getLoggedInUser"), Authorize(Roles = "user")]
    public async Task<ActionResult<UserInfoDTO>> GetLoggedInUser()
    {

        var user = await _userService.GetLoggedInUserInfoAsync();

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpDelete("unSaveTrip/{tripId}"), Authorize(Roles = "user")]
    public async Task<IActionResult> UnsaveTrip(string tripId)
    {

        var success = await _userService.UnSaveTrip(tripId);
        if (!success)
            return NotFound("Putovanje nije pronađeno ili već nije sačuvano.");

        return Ok("Uklonjeno putovanje iz liste omiljenih "); 
    }
}

