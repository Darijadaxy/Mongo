using MongoDB.Driver;
using WebTemplate.DTOs;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly ITripRepository _tripRepository;
    private readonly IAuthService _authService;
    private readonly IReservationRepository _reservationRepository;

    private static readonly List<string> administratori = ["anastasija.simic", "darija.denic", "sanja.simic"];


    public UserService(
        IUserRepository userRepository,
        ITripRepository tripRepository,
        IAuthService authService,
        IReservationRepository reservationRepository)
    {
        _userRepository = userRepository;
        _tripRepository = tripRepository;
        _authService = authService;
        _reservationRepository = reservationRepository;

    }
    public async Task<User> CreateAsync(CreateUserDTO dto)
    {
        //izdvojila bih, ne svidja mi se sto je sve ovde
        var existingUser = await _userRepository
            .FindByUsernameOrEmailAsync(dto.Username, dto.Email);

        if (existingUser != null)
            throw new Exception("User with given username or email already exists!");

        if (!IsValidEmail(dto.Email))
            throw new FormatException("Invalid email format.");

        if (!dto.PhoneNumber.All(char.IsDigit))
            throw new FormatException("Phone number must contain only digits.");

        if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 8)
            throw new ArgumentException("Password must be at least 8 characters long.");

        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Name = dto.Name,
            Surname = dto.Surname,
            PhoneNumber = dto.PhoneNumber,
            Username = dto.Username,
            Email = dto.Email,
            Password = hashedPassword
        };

        await _userRepository
            .InsertAsync(user);

        return user;
    }

    public async Task<bool> DeleteAsync(string id) //dodati uslove kada korisnik NE sme biti obrisan
    {
        var result = await _userRepository
            .DeleteAsync(id);

        return result.DeletedCount > 0;
    }

    public async Task<bool> DeleteProfile()
    {
        var username = _authService.GetUsernameFromToken();
        var user = await _userRepository.FindByUsernameAsync(username);

        if (user == null)
            return false;

        var userReservations = await _reservationRepository.GetUserReservations(user.Id!);
        if (userReservations.Any())
        {
            return false;
        }

        var result = await _userRepository
            .DeleteAsync(user.Id!);

        return result.DeletedCount > 0;
    }

    public async Task<List<UserInfoDTO>> GetAllAsync()
    {
        var users = await _userRepository
            .GetAllAsync();

        var usersDTO = users.Select(u => new UserInfoDTO
        {
            Id = u.Id!,
            Name = u.Name,
            Surname = u.Surname,
            PhoneNumber = u.PhoneNumber,
            Username = u.Username,
            Email = u.Email

        }).ToList();

        return usersDTO;
    }

    public async Task<UserInfoDTO?> GetByIdAsync(string id)
    {
        var user = await _userRepository
            .GetByIdAsync(id);

        if (user == null)
            return null;

        return new UserInfoDTO
        {
            Id = user.Id!,
            Name = user.Name,
            Surname = user.Surname,
            PhoneNumber = user.PhoneNumber,
            Username = user.Username,
            Email = user.Email
        };

    }

    public async Task<bool> UpdateAsync(string id, UpdateUserDTO dto)
    {
        var updateDef = new List<UpdateDefinition<User>>();
        var builder = Builders<User>.Update;

        if (!string.IsNullOrEmpty(dto.PhoneNumber))
            updateDef.Add(builder.Set(d => d.PhoneNumber, dto.PhoneNumber));

        //PROVERA DA NE SME DA DODA USERNAME KOJI VEC NEKO IMA U BAZI!! - i to i email su nam unique koliko kapiram?
        if (!string.IsNullOrEmpty(dto.Username))
            updateDef.Add(builder.Set(d => d.Username, dto.Username));

        if (!string.IsNullOrEmpty(dto.Password))
            updateDef.Add(builder.Set(d => d.Password, BCrypt.Net.BCrypt.HashPassword(dto.Password)));

        if (updateDef.Count == 0)
            return false;

        var result = await _userRepository
            .UpdateAsync(id, builder.Combine(updateDef));

        return result.MatchedCount > 0;
    }

    public async Task<bool> UpdateAsync(UpdateUserDTO dto)
    {
        var username = _authService.GetUsernameFromToken();
        var user = await _userRepository.FindByUsernameAsync(username);

        if (user == null)
            return false;


        var updateDef = new List<UpdateDefinition<User>>();
        var builder = Builders<User>.Update;

        if (!string.IsNullOrEmpty(dto.PhoneNumber))
            updateDef.Add(builder.Set(d => d.PhoneNumber, dto.PhoneNumber));

        //PROVERA DA NE SME DA DODA USERNAME KOJI VEC NEKO IMA U BAZI!! - i to i email su nam unique koliko kapiram?
        if (!string.IsNullOrEmpty(dto.Username))
            updateDef.Add(builder.Set(d => d.Username, dto.Username));

        if (!string.IsNullOrEmpty(dto.Password))
            updateDef.Add(builder.Set(d => d.Password, BCrypt.Net.BCrypt.HashPassword(dto.Password)));

        if (updateDef.Count == 0)
            return false;

        var result = await _userRepository
            .UpdateAsync(user.Id!, builder.Combine(updateDef));

        return result.MatchedCount > 0;
    }

    private bool IsValidEmail(string email) //izdvojila bih i to negde
    {
        return System.Text.RegularExpressions.Regex.IsMatch(
            email,
            @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
            System.Text.RegularExpressions.RegexOptions.IgnoreCase
        );
    }
    public async Task<bool> SaveTrip(string tripId)
    {
        var username = _authService.GetUsernameFromToken();
        var user = await _userRepository.FindByUsernameAsync(username);

        if (user == null)
            return false;

        return await _userRepository.SaveTrip(user.Id!, tripId);
    }
    public async Task<List<SavedTripDTO>> GetSavedTrips()
    {
        var username = _authService.GetUsernameFromToken();
        var user = await _userRepository.FindByUsernameAsync(username);

        if (user == null)
            return [];

        List<SavedTripDTO> sacuvanaPutovanja = new List<SavedTripDTO>();

        var savedTripIds = await _userRepository.GetSavedTrips(user.Id!);
        foreach (string id in savedTripIds)
        {
            var trip = await _tripRepository.GetByIdAsync(id);
            if (trip != null)
            {
                sacuvanaPutovanja.Add(new SavedTripDTO
                {
                    Id = trip.Id!,
                    Name = trip.Name,
                    Price = trip.Price,
                    Vehicle = trip.Vehicle,
                    Picture = trip.Picture,
                    AvailableDates = trip.AvailableDates
                });
            }
        }
        return sacuvanaPutovanja;
    }

    public async Task<string?> LogInAsync(LogInDTO loginDTO)
    {
        if (string.IsNullOrWhiteSpace(loginDTO.Username) || string.IsNullOrWhiteSpace(loginDTO.Password))
            return null;

        var user = await _userRepository.FindByUsernameAsync(loginDTO.Username);

        if (user == null)
            return null;

        bool correctPassword = BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.Password);

        if (!correctPassword)
        {
            return null;
        }

        return _authService.CreateToken(
                loginDTO.Username,
                administratori.Contains(user.Username)
            );

    }

    public async Task<UserInfoDTO?> GetLoggedInUserInfoAsync()
    {
        var username = _authService.GetUsernameFromToken();
        var roles = _authService.GetRolesFromToken();

        if (string.IsNullOrEmpty(username))
            return null;

        var user = await _userRepository.FindByUsernameAsync(username);

        if (user == null)
            return null;

        return new UserInfoDTO
        {
            Id = user.Id!,
            Name = user.Name,
            Surname = user.Surname,
            PhoneNumber = user.PhoneNumber,
            Username = user.Username,
            Email = user.Email,
            isAdmin = roles.Contains("admin")
        };
    }
    public async Task<bool> UnSaveTrip(string tripId)
    {
        var username = _authService.GetUsernameFromToken();
        var user = await _userRepository.FindByUsernameAsync(username);

        if (user == null || !user.SavedTrips.Contains(tripId))
            return false;

        var update = Builders<User>.Update.Pull(u => u.SavedTrips, tripId);
        await _userRepository.UpdateAsync(user.Id!, update);

        return true;

    }
}
