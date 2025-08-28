using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebTemplate.DTOs;

[ApiController]
[Route("[controller]")]
public class ReservationController : ControllerBase
{
    private readonly IReservationService _reservationService;

    public ReservationController(IReservationService reservationService)
    {

        _reservationService = reservationService;
    }

    [HttpPost("AddReservation"), Authorize(Roles = "user")]
    public async Task<ActionResult<Reservation>> AddReservation([FromBody] CreateReservationDTO reservationDTO)
    {
        var reservation = await _reservationService.AddReservation(reservationDTO);
        return Ok(reservation);
    }

    [HttpGet("getAllReservations"), Authorize(Roles = "admin")]
    public async Task<ActionResult<Reservation>> GetAllReservations()
    {
        var reservations = await _reservationService.GetAllReservations();

        return Ok(reservations);
    }


    [HttpGet("getReservation/{id}"), Authorize(Roles = "user")]
    public async Task<ActionResult<Reservation>> GetReservation(string id)
    {

        var reservation = await _reservationService.GetReservation(id);

        if (reservation == null)
            return NotFound();

        return Ok(reservation);
    }

    [HttpPut("updateReservation/{id}"), Authorize(Roles = "user")]
    public async Task<IActionResult> UpdateReservation(string id, [FromBody] UpdateReservationDTO dto)
    {
        var success = await _reservationService.UpdateReservation(id, dto);

        if (!success)
            return BadRequest("Azuriranje nije uspelo");

        return Ok("Uspesno azurirana rezervacija");
    }

    [HttpDelete("deleteReservation/{id}"), Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteReservation(string id)
    {
        var deleted = await _reservationService.DeleteReservation(id);

        if (!deleted)
            return BadRequest("Nije moguce obristi ovu rezervaciju");

        return Ok("Uspesno obrisana rezervacija");
    }

    [HttpGet("getUserReservations/{userId}"), Authorize(Roles = "admin")] 
    public async Task<IActionResult> GetUserReservations(string userId)
    {

        var reservations = await _reservationService.GetUserReservations(userId);

        if (reservations == null || reservations.Count == 0)
        {
            return NotFound("Rezervacije za korisnika nisu pronađene");
        }

        return Ok(reservations);
    }

    [HttpGet("getUserReservations"), Authorize(Roles = "user")]
    public async Task<IActionResult> GetUserReservations()
    {

        var reservations = await _reservationService.GetUserReservations();

        if (reservations == null || reservations.Count == 0)
        {
            return NotFound("Rezervacije za korisnika nisu pronađene");
        }

        return Ok(reservations);
    }


    [HttpGet("getTripReservations/{tripId}"), Authorize(Roles = "admin")]
    public async Task<IActionResult> GetTripReservations(string tripId)
    {

        var reservations = await _reservationService.GetTripReservations(tripId);

        if (reservations == null || reservations.Count == 0)
        {
            return Ok(new List<Reservation>());
        }

        return Ok(reservations);

    }
    [HttpPut("updateReservationStatus/{id}/{status}"), Authorize(Roles = "user")]
    public async Task<IActionResult> UpdateReservationStatus(string id, ReservationStatus status)
    {
        var success = await _reservationService.UpdateReservationStatus(id, status);

        if (!success)
            return BadRequest("Azuriranje statusa nije uspelo");

        return Ok("Uspesno azurirana statuse");
    }

}
