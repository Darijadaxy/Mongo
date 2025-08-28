using Microsoft.AspNetCore.Mvc;
using WebTemplate.DTOs;

public interface IUserService
{
    Task<List<UserInfoDTO>> GetAllAsync();
    Task<UserInfoDTO?> GetByIdAsync(string id);
    Task<User> CreateAsync(CreateUserDTO dto);
    Task<bool> UpdateAsync(string id, UpdateUserDTO dto);
    Task<bool> UpdateAsync(UpdateUserDTO dto); //korisnik azurira svoj profil
    Task<bool> DeleteAsync(string id);
    Task<bool> DeleteProfile();
    Task<bool> SaveTrip(string tripId);
    Task<List<SavedTripDTO>> GetSavedTrips();
    Task<string?> LogInAsync(LogInDTO loginDTO);
    Task<UserInfoDTO?> GetLoggedInUserInfoAsync();
    Task<bool> UnSaveTrip(string tripId);
}
