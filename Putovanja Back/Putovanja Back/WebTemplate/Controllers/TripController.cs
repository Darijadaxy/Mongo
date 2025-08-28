using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebTemplate.DTOs;

[ApiController]
[Route("[controller]")]
public class TripController : ControllerBase
{
    private readonly ITripService _tripService;

    public TripController(ITripService tripService)
    {
        _tripService = tripService;
    }

    [HttpPost("createTrip"), Authorize(Roles = "admin")]
    public async Task<ActionResult<Trip>> CreateTrip([FromBody] CreateTripDTO dto)
    {
        var trip = await _tripService.CreateAsync(dto);
        return Ok(trip);
    }

    [HttpGet("getAllTrips"), Authorize(Roles = "admin")]
    public async Task<ActionResult<List<Trip>>> GetAllTrips()
    {
        var trips = await _tripService.GetAllAsync();
        return Ok(trips);
    }

    [HttpGet("getTrip/{id}"), Authorize(Roles = "user")]
    public async Task<ActionResult<Trip>> GetTripById(string id)
    {
        var trip = await _tripService.GetByIdAsync(id);

        if (trip == null)
            return NotFound();

        return Ok(trip);
    }

    [HttpPut("updateTrip/{id}"), Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateTrip(string id, [FromBody] UpdateTripDTO dto)
    {
        var success = await _tripService.UpdateAsync(id, dto);

        if (!success)
            return NotFound("Putovanje nije pronađeno ili nije pravilno ažurirano.");

        return Ok("Uspešno ste ažurirali putovanje.");
    }

    [HttpDelete("deleteTrip/{id}"), Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteTrip(string id)
    {
        var deleted = await _tripService.DeleteAsync(id);

        if (!deleted)
            return NotFound("Putovanje nije pronađeno ili postoje rezervacije za to putovanje.");

        return Ok("Uspešno obrisano putovanje.");
    }

    [HttpGet("getAvailableTrips")]
    public async Task<ActionResult<List<Trip>>> GetAvailableTrips()
    {
        var trips = await _tripService.GetAvailableAsync();
        return Ok(trips);
    }


    [HttpPatch("changeStatus/{id}/{status}"), Authorize(Roles = "admin")]
    public async Task<IActionResult> ChangeTripStatus(string id, TripStatus status)
    {
        var success = await _tripService.ChangeStatusAsync(id, status);

        if (!success)
            return NotFound("Putovanje nije pronađeno ili status nije promenjen.");

        return Ok("Status putovanja je uspešno izmenjen.");
    }

    [HttpGet("getTripDetails/{id}")]
    public async Task<ActionResult<TripDetailsDTO>> GetTripDetails(string id)
    {
        var tripDetails = await _tripService.GetDetailsAsync(id);
        if (tripDetails == null)
            return NotFound("Putovanje nije pronađeno.");

        return Ok(tripDetails);
    }

    [HttpPost("addReview/{tripId}"), Authorize(Roles = "user")]
    public async Task<IActionResult> AddReview(string tripId, [FromBody] CreateReviewDTO reviewDTO)
    {
        var success = await _tripService.AddReviewAsync(tripId, reviewDTO);

        if (!success)
            return NotFound("Trip not found or review not added.");

        return Ok("Review added successfully.");
    }

    [HttpGet("getReviews/{tripId}")]
    public async Task<ActionResult<List<ReviewInfoDTO>>> GetReviews(string tripId)
    {
        var reviews = await _tripService.GetReviewsAsync(tripId);

        return Ok(reviews);
    }

    [HttpGet("filter")]
    public async Task<ActionResult<List<Trip>>> FilterTrips([FromQuery] TripFilterDTO filterDTO)
    {
        var results = await _tripService.FilterAsync(filterDTO);
        return Ok(results);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest("Query parameter is required.");

        var trips = await _tripService.SearchAsync(query);
        return Ok(trips);
    }


}