using MongoDB.Driver;
using WebTemplate.DTOs;

public class ReservationService : IReservationService
{
    private readonly IReservationRepository _reservationRepository;
    private readonly ITripRepository _tripRepository;
    private readonly IUserRepository _userRepository;

    private readonly IAuthService _authService;

    public ReservationService(
        IReservationRepository reservationRepository,
        ITripRepository tripRepository,
        IUserRepository userRepository,
        IAuthService authService)
    {
        _reservationRepository = reservationRepository;
        _tripRepository = tripRepository;
        _userRepository = userRepository;
        _authService = authService;
    }

    public async Task<Reservation?> AddReservation(CreateReservationDTO reservationdto)
    {
        var username = _authService.GetUsernameFromToken();
        var user = await _userRepository.FindByUsernameAsync(username);

        if (user == null)
            return null;


        var trip = await _tripRepository.GetByIdAsync(reservationdto.TripId);
        if (trip == null)
        {
            throw new Exception("Putovanje nije pronadjeno");
        }

        int totalPrice = trip.Price * reservationdto.NumberOfPeople;

        bool dateIsValid = trip.AvailableDates?.Any(d =>
            d.StartDate == reservationdto.Date.StartDate.Date &&
            d.EndDate == reservationdto.Date.EndDate.Date
        ) ?? false;

        if (!dateIsValid)
        {
            throw new Exception("Izabrani datum nije dostupan za ovo putovanje.");
        }

        var reservation = new Reservation
        {
            UserId = user.Id!,
            TripId = reservationdto.TripId,
            Date = reservationdto.Date,
            NumberOfPeople = reservationdto.NumberOfPeople,
            TotalPrice = totalPrice,
            Status = ReservationStatus.Pending
        };

        await _reservationRepository
            .AddReservation(reservation);

        return reservation;
    }

    public async Task<bool> DeleteReservation(string id)
    {
        var reservation = await _reservationRepository.GetReservation(id);
        if (reservation == null)
            return false;
        if (reservation.Status == ReservationStatus.Canceled || reservation.Date.EndDate < DateTime.Now)
        {
            return await _reservationRepository.DeleteReservation(id);
        }
        else return false;
    }

    public async Task<List<ReservationDTO>> GetAllReservations()
    {
        //return await _reservationRepository.GetAllReservations();
        var reservations = await _reservationRepository.GetAllReservations();
        var users = await _userRepository.GetAllAsync();
        var trips = await _tripRepository.GetAllAsync();

        return reservations.Select(r => new ReservationDTO
        {
            Id = r.Id!,
            Username = users.FirstOrDefault(u => u.Id == r.UserId)?.Username ?? "Nepoznat korisnik",
            TripName = trips.FirstOrDefault(t => t.Id == r.TripId)?.Name ?? "Nepoznata destinacija",
            Date = r.Date,
            NumberOfPeople = r.NumberOfPeople,
            TotalPrice = r.TotalPrice,
            Status = r.Status
        }).ToList();
    }

    public async Task<ReservationWithTripDTO?> GetReservation(string id)
    {
        var reservation = await _reservationRepository.GetReservation(id);
        var trip = await _tripRepository.GetByIdAsync(reservation!.TripId);
        var result = new ReservationWithTripDTO
        {
            Id = reservation.Id!,
            UserId = reservation.UserId,
            TripId = reservation.TripId,
            TripName = trip!.Name,
            Date = reservation.Date,
            NumberOfPeople = reservation.NumberOfPeople,
            TotalPrice = reservation.TotalPrice,
            Status = reservation.Status
        };
        return result;
    }

    public async Task<bool> UpdateReservation(string id, UpdateReservationDTO reservation)
    {
        var res = await _reservationRepository.GetReservation(id);
        if (res == null) return false;

        if (reservation.Date != null)
        {
            var trip = await _tripRepository.GetByIdAsync(res.TripId);
            if (trip == null) return false;

            bool dateIsValid = trip.AvailableDates?.Any(d =>
                d.StartDate == reservation.Date.StartDate &&
                d.EndDate == reservation.Date.EndDate
            ) ?? false;

            if (!dateIsValid)
            {
                return false; 
            }

            res.Date = reservation.Date;
        }

        if (reservation.NumberOfPeople.HasValue)
        {
            res.NumberOfPeople = reservation.NumberOfPeople.Value;
            var trip = await _tripRepository.GetByIdAsync(res.TripId);
            if (trip == null)
            {
                return false;
            }

            res.TotalPrice = (int)(reservation.NumberOfPeople * trip.Price);
        }


        return await _reservationRepository.UpdateReservation(id, res);

    }
    public async Task<List<ReservationWithTripDTO>> GetUserReservations(string userId)
    {
        var reservations = await _reservationRepository.GetUserReservations(userId);
        var result = new List<ReservationWithTripDTO>();

        foreach (var reservation in reservations)
        {
            var trip = await _tripRepository.GetByIdAsync(reservation.TripId);

            result.Add(new ReservationWithTripDTO
            {
                Id = reservation.Id!,
                UserId = reservation.UserId,
                TripId = reservation.TripId,
                TripName = trip!.Name,
                Date = reservation.Date,
                NumberOfPeople = reservation.NumberOfPeople,
                TotalPrice = reservation.TotalPrice,
                Status = reservation.Status
            });
        }

        return result;

    }
    public async Task<List<ReservationDTO>> GetTripReservations(string tripId)
    {
        var reservations = await _reservationRepository.GetTripReservations(tripId);
        var users = await _userRepository.GetAllAsync();
        var result = new List<ReservationDTO>();

        foreach (var reservation in reservations)
        {
            var trip = await _tripRepository.GetByIdAsync(reservation.TripId);

            result.Add(new ReservationDTO
            {
                Id = reservation.Id!,
                Username = users.FirstOrDefault(u => u.Id == reservation.UserId)?.Username ?? "Nepoznat korisnik",
                TripName = trip!.Name,
                Date = reservation.Date,
                NumberOfPeople = reservation.NumberOfPeople,
                TotalPrice = reservation.TotalPrice,
                Status = reservation.Status
            });
        }

        return result;
    }
    public async Task<bool> UpdateReservationStatus(string id, ReservationStatus status)
    {
        return await _reservationRepository.UpdateReservationStatus(id, status);
    }

    public async Task<List<ReservationWithTripDTO>> GetUserReservations()
    {
        var username = _authService.GetUsernameFromToken();
        var user = await _userRepository.FindByUsernameAsync(username);

        if (user == null)
            return [];


        var reservations = await _reservationRepository.GetUserReservations(user.Id!);
        var result = new List<ReservationWithTripDTO>();

        foreach (var reservation in reservations)
        {
            var trip = await _tripRepository.GetByIdAsync(reservation.TripId);

            result.Add(new ReservationWithTripDTO
            {
                Id = reservation.Id!,
                UserId = reservation.UserId,
                TripId = reservation.TripId,
                TripName = trip!.Name,
                Date = reservation.Date,
                NumberOfPeople = reservation.NumberOfPeople,
                TotalPrice = reservation.TotalPrice,
                Status = reservation.Status
            });
        }

        return result;
    }
}