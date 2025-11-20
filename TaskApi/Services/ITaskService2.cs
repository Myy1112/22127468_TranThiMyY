using TaskApi.Models;

namespace TaskApi.Services
{
    public interface ITaskService2
    {
        Task<IEnumerable<TaskItem>> GetAllAsync();
        Task<TaskItem?> GetByIdAsync(int id);
        Task<TaskItem> CreateAsync(TaskItem item);
        Task UpdateAsync(TaskItem item);
        Task DeleteAsync(int id);
    }
}
