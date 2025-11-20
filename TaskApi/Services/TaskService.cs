// File: TaskApi/Services/TaskService.cs

using TaskApi.Models;
using TaskApi.Repositories;

namespace TaskApi.Services
{
    // CẦN SỬA LẠI: từ ITaskService2 sang ITaskService và ITaskRepository2 sang ITaskRepository
    public class TaskService : ITaskService 
    {
    private readonly ITaskRepository _repo;
    public TaskService(ITaskRepository repo) => _repo = repo;

        public Task<TaskItem> CreateAsync(TaskItem item) => _repo.AddAsync(item);
        public Task DeleteAsync(int id) => _repo.DeleteAsync(id);
        public Task<IEnumerable<TaskItem>> GetAllAsync() => _repo.GetAllAsync();
        public Task<TaskItem?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task UpdateAsync(TaskItem item) => _repo.UpdateAsync(item);

        // ĐẢM BẢO TRIỂN KHAI PHƯƠNG THỨC LỌC
        public Task<IEnumerable<TaskItem>> GetByStatusAsync(bool isCompleted) => _repo.GetByStatusAsync(isCompleted);
    }
}