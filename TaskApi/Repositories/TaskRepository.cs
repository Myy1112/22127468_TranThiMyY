using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Models;

namespace TaskApi.Repositories
{
    // Sửa ITaskRepository2 thành ITaskRepository
    public class TaskRepository : ITaskRepository 
    {
        private readonly AppDbContext _db;
        public TaskRepository(AppDbContext db) => _db = db;

        public async Task<TaskItem> AddAsync(TaskItem item)
        {
            _db.Tasks.Add(item);
            await _db.SaveChangesAsync();
            return item;
        }

        public async Task DeleteAsync(int id)
        {
            var e = await _db.Tasks.FindAsync(id);
            if (e != null)
            {
                _db.Tasks.Remove(e);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<TaskItem>> GetAllAsync()
        {
            // Sắp xếp mặc định: chưa hoàn thành trước, sau đó sắp xếp theo DueDate
            return await _db.Tasks.OrderBy(t => t.IsCompleted).ThenBy(t => t.DueDate).ToListAsync();
        }

        public async Task<TaskItem?> GetByIdAsync(int id) => await _db.Tasks.FindAsync(id);

        public async Task UpdateAsync(TaskItem item)
        {
            _db.Tasks.Update(item);
            await _db.SaveChangesAsync();
        }
        
        // Triển khai phương thức lọc
        public async Task<IEnumerable<TaskItem>> GetByStatusAsync(bool isCompleted)
        {
            return await _db.Tasks
                            .Where(t => t.IsCompleted == isCompleted)
                            .OrderBy(t => t.DueDate)
                            .ToListAsync();
        }
    }
}