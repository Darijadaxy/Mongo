using MongoDB.Driver;
using WebTemplate.DTOs;

public class DestinationService : IDestinationService
{
    private readonly IDestinationRepository _destinationRepository;
    private readonly ITripRepository _tripRepository;


    public DestinationService(IDestinationRepository destinationRepository, ITripRepository tripRepository)
    {
        _destinationRepository = destinationRepository;
        _tripRepository = tripRepository;
    }

    public async Task<Destination> CreateAsync(CreateDestinationDTO dto)
    {
        var destination = new Destination
        {
            Name = dto.Name,
            Description = dto.Description,
            Images = dto.Images
        };

        await _destinationRepository
            .InsertAsync(destination);
            
        return destination;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var filter = Builders<Trip>.Filter.ElemMatch(
            t => t.Destinations,
            d => d.Id == id
        );

        var exists = await _tripRepository.AnyAsync(filter);

        if (exists)
        {
            return false;
        }

        var result = await _destinationRepository
            .DeleteAsync(id);

        return result.DeletedCount > 0;
    }

    public async Task<List<Destination>> GetAllAsync()
    {
        return await _destinationRepository
            .GetAllAsync();
    }

    public async Task<Destination?> GetByIdAsync(string id)
    {
        return await _destinationRepository
            .GetByIdAsync(id);
    }

    public async Task<bool> UpdateAsync(string id, UpdateDestinationDTO dto)
    {
        var updateDef = new List<UpdateDefinition<Destination>>();
        var builder = Builders<Destination>.Update;

        if (!string.IsNullOrEmpty(dto.Name))
            updateDef.Add(builder.Set(d => d.Name, dto.Name));

        if (!string.IsNullOrEmpty(dto.Description))
            updateDef.Add(builder.Set(d => d.Description, dto.Description));

        if (dto.Images != null && dto.Images.Count > 0)
            updateDef.Add(builder.Set(d => d.Images, dto.Images));

        if (updateDef.Count == 0)
            return false;

        var result = await _destinationRepository
            .UpdateAsync(id, builder.Combine(updateDef));

        return result.MatchedCount > 0;
    }
}