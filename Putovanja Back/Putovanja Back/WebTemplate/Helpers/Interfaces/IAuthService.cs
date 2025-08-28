public interface IAuthService
{
    string CreateToken(string username, bool isAdmin);
    string GetUsernameFromToken();
    List<string> GetRolesFromToken();
}
