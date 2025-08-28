using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using WebTemplate.DTOs;

public class TripService : ITripService
{
    private readonly ITripRepository _tripRepository;
    private readonly IDestinationRepository _destinationRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAuthService _authService;



    public TripService(
        ITripRepository tripRepository,
        IDestinationRepository destinationRepository,
        IUserRepository userRepository,
        IAuthService authService)
    {
        _tripRepository = tripRepository;
        _destinationRepository = destinationRepository;
        _userRepository = userRepository;
        _authService = authService;
    }

    public async Task<Trip> CreateAsync(CreateTripDTO dto)
    {
        var destinations = new List<DestinationInfo>();

        foreach (var destinationId in dto.DestinationIds)
        {
            var destination = await _destinationRepository.GetByIdAsync(destinationId);
            if (destination != null)
            {
                destinations.Add(new DestinationInfo
                {
                    Id = destination.Id!,
                    Name = destination.Name
                });
            }
            else
            {
                throw new Exception($"Destinacija sa id-ijem '{destinationId}' ne postoji.");
            }
        }

        var trip = new Trip
        {
            Name = dto.Name,
            Destinations = destinations,
            Price = dto.Price,
            Description = dto.Description,
            AvailableDates = dto.AvailableDates,
            //Reviews = new List<Review>(),
            Status = dto.Status,
            Vehicle = dto.Vehicle,
            //Picture = dto.Picture,

        };
        if (dto.Picture != "")
        {
            trip.Picture = dto.Picture;
        }

        return await _tripRepository.CreateAsync(trip);
    }

    public async Task<List<Trip>> GetAllAsync()
    {
        var trips = await _tripRepository.GetAllAsync();

        return trips;
    }

    public async Task<Trip?> GetByIdAsync(string id)
    {
        var trip = await _tripRepository.GetByIdAsync(id);

        return trip;
    }

    public async Task<bool> UpdateAsync(string id, UpdateTripDTO dto)
    {
        var trip = await _tripRepository.GetByIdAsync(id);
        if (trip == null) return false;

        if (dto.Name != null) trip.Name = dto.Name;
        if (dto.Description != null) trip.Description = dto.Description;
        if (dto.Price.HasValue) trip.Price = dto.Price.Value;
        if (dto.Status.HasValue) trip.Status = dto.Status.Value;
        if (dto.Vehicle.HasValue) trip.Vehicle = dto.Vehicle.Value;
        if (dto.Picture != null) trip.Picture = dto.Picture;

        if (dto.DestinationIds != null)
        {
            var destinations = new List<DestinationInfo>();

            foreach (var destinationId in dto.DestinationIds)
            {
                var destination = await _destinationRepository.GetByIdAsync(destinationId);
                if (destination != null)
                {
                    destinations.Add(new DestinationInfo
                    {
                        Id = destination.Id!,
                        Name = destination.Name
                    });
                }
                else
                {
                    throw new Exception($"Destinacija sa id-ijem '{destinationId}' nije pronađena.");
                }
            }

            trip.Destinations = destinations;
        }

        if (dto.AvailableDates != null)
            trip.AvailableDates = dto.AvailableDates;

        return await _tripRepository.UpdateAsync(trip);
    }

    //MORA PROVERA DA LI SME DA SE OBRISE???
    public async Task<bool> DeleteAsync(string id) => await _tripRepository.DeleteAsync(id);

    public async Task<List<Trip>> GetAvailableAsync()
    {
        var trips = await _tripRepository.GetAvailableAsync();

        return trips;
    }

    public async Task<bool> ChangeStatusAsync(string tripId, TripStatus newStatus)
    {
        var trip = await _tripRepository.GetByIdAsync(tripId);
        if (trip == null) return false;

        trip.Status = newStatus;
        return await _tripRepository.UpdateAsync(trip);
    }

    public async Task<TripDetailsDTO?> GetDetailsAsync(string id)
    {
        var trip = await _tripRepository.GetByIdAsync(id);
        if (trip == null) return null;

        foreach (var dest in trip.Destinations)
        {
            var destination = await _destinationRepository.GetByIdAsync(dest.Id);
            dest.Name = destination?.Name ?? "Unknown";
        }

        return new TripDetailsDTO
        {
            Id = trip.Id,
            Name = trip.Name,
            Destinations = trip.Destinations,
            Price = trip.Price,
            AverageRating = trip.AverageRating,
            Description = trip.Description,
            AvailableDates = trip.AvailableDates,
            Vehicle = trip.Vehicle,
            Status = trip.Status,
            Picture = trip.Picture
        };
    }
    public async Task<bool> AddReviewAsync(string tripId, CreateReviewDTO dto)
    {
        var username = _authService.GetUsernameFromToken();
        var user = await _userRepository.FindByUsernameAsync(username);

        if (user == null)
            return false;


        if (dto.Rating < 1 || dto.Rating > 5)
        {
            //throw new ArgumentException("Rating must be between 1 and 5.");
            return false;
        }

        var trip = await _tripRepository.GetByIdAsync(tripId);
        if (trip == null)
        {
            // throw new Exception("Trip not found");
            return false;
        }

        var review = new Review
        {
            UserId = user.Id!,
            Text = dto.Text,
            Rating = dto.Rating
        };

        var allReviews = trip.Reviews ?? new List<Review>();
        allReviews.Add(review);

        double newAverage = allReviews.Average(r => r.Rating);

        var update = Builders<Trip>.Update
            .Set(t => t.Reviews, allReviews)
            .Set(t => t.AverageRating, newAverage);

        var result = await _tripRepository
            .UpdateReviewsAndRatingAsync(tripId, update);

        return result.MatchedCount > 0;
    }

    public async Task<List<ReviewInfoDTO>> GetReviewsAsync(string tripId)
    {
        var trip = await _tripRepository.GetByIdAsync(tripId);

        if (trip == null || trip.Reviews == null)
            return [];

        return trip.Reviews
            .Select(r => new ReviewInfoDTO
            {
                Text = r.Text,
                Rating = r.Rating
            })
            .ToList();
    }

    public async Task<List<TripDetailsDTO>> FilterAsync(TripFilterDTO filterDTO)
    {
        var filterBuilder = Builders<Trip>.Filter;
        var filter = filterBuilder.Empty;

        if (filterDTO.MinPrice.HasValue)
            filter &= filterBuilder.Gte(t => t.Price, filterDTO.MinPrice.Value); //Greater Than or Equal; uslov se dodaje na postojeci filter logickim and operatorom

        if (filterDTO.MaxPrice.HasValue)
            filter &= filterBuilder.Lte(t => t.Price, filterDTO.MaxPrice.Value);

        if (filterDTO.MinRating.HasValue)
            filter &= filterBuilder.Gte(t => t.AverageRating, filterDTO.MinRating.Value);

        if (filterDTO.Vehicle.HasValue)
            filter &= filterBuilder.Eq(t => t.Vehicle, filterDTO.Vehicle.Value);

        //nesto mi ovaj datum los
        if (filterDTO.StartDate.HasValue && filterDTO.EndDate.HasValue && filterDTO.StartDate.Value < filterDTO.EndDate.Value)
        {
            filter &= filterBuilder.ElemMatch(t => t.AvailableDates, //ElemMatch je filter za ugnjezdenu listu -> DateRange koji je unutar prosledjenog datuma
                                                                     //d => d.StartDate <= filterDTO.StartDate.Value && d.EndDate >= filterDTO.EndDate.Value);
                d => d.StartDate <= filterDTO.EndDate.Value && d.EndDate >= filterDTO.StartDate.Value); //putovanje se makar delimično preklapa sa korisnikovim traženim periodom.

        }

        return await _tripRepository.FilterAsync(filter);
    }

    public async Task<List<TripDetailsDTO>> SearchAsync(string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
            return new List<TripDetailsDTO>();

        var filter = Builders<Trip>.Filter.Text(searchTerm); //text search trazi reci ili korene reci, ali ne i delimicne podudarnosti/podstringove, moze koriscenje regex-a nekako da se to resi

        return await _tripRepository.FilterAsync(filter);
    }


}