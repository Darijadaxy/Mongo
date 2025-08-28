using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebTemplate.DTOs;

[ApiController]
[Route("[controller]")]
public class DestinationController : ControllerBase
{
    private readonly IDestinationService _destinationService;

    public DestinationController(IDestinationService destinationService)
    {

        _destinationService = destinationService;
    }

    [HttpPost("createDestination"), Authorize(Roles = "admin")]
    public async Task<ActionResult<Destination>> CreateDestination([FromBody] CreateDestinationDTO destinationDTO)
    {
        var destination = await _destinationService.CreateAsync(destinationDTO);
        return Ok(destination);
    }

    [HttpGet("getAllDestinations"), Authorize(Roles = "admin")]
    public async Task<ActionResult<Destination>> GetAllDestinations()
    {
        var destinations = await _destinationService.GetAllAsync();

        return Ok(destinations);
    }


    [HttpGet("getDestination/{id}")]
    public async Task<ActionResult<Destination>> GetDestinationById(string id)
    {
        var destination = await _destinationService.GetByIdAsync(id);

        if (destination == null)
            return NotFound();

        return Ok(destination);
    }

    [HttpPut("updateDestination/{id}"), Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateDestination(string id, [FromBody] UpdateDestinationDTO dto)
    {
        var success = await _destinationService.UpdateAsync(id, dto);

        if (!success)
            return NotFound("Destination not found or no fields to update.");

        return Ok("Destination successfully updated!");
    }

    [HttpDelete("deleteDestination/{id}"), Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteDestination(string id)
    {
        var deleted = await _destinationService.DeleteAsync(id);

        if (!deleted)
            return BadRequest("Destinacija nije pronađena ili je pridružena nekom putovanju!");

        return Ok("Destinacija je uspešno obrisana!");
    }

}
