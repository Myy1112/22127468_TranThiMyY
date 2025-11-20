// File: TaskApi/Services/ITaskService.cs

using TaskApi.Models;

namespace TaskApi.Services
{
    // Đảm bảo Interface là ITaskService (không phải ITaskService2)
    public interface ITaskService 
    {
        Task<IEnumerable<TaskItem>> GetAllAsync();
        Task<TaskItem?> GetByIdAsync(int id);
        Task<TaskItem> CreateAsync(TaskItem item);
        Task UpdateAsync(TaskItem item);
        Task DeleteAsync(int id);
        // CẦN THÊM: Định nghĩa phương thức lọc
        Task<IEnumerable<TaskItem>> GetByStatusAsync(bool isCompleted); 
    }
}