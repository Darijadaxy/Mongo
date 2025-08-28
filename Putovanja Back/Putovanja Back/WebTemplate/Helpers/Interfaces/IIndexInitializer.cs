using System.Threading.Tasks;

public interface IIndexInitializer
{
    Task CreateIndexesAsync();
}
