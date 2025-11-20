using Microsoft.AspNetCore.Mvc;
using TaskApi.Models;
using TaskApi.Services;

namespace TaskApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
    // Sửa ITaskService2 thành ITaskService
    private readonly ITaskService _service;
    public TasksController(ITaskService service) => _service = service;

        // Endpoint cũ: Lấy tất cả task (Sorted by IsCompleted, then DueDate)
        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        // Bổ sung: Endpoint lọc theo trạng thái
        // Ví dụ: GET /api/Tasks/status/true (Đã hoàn thành) hoặc GET /api/Tasks/status/false (Đang làm)
        [HttpGet("status/{isCompleted:bool}")]
        public async Task<IActionResult> GetByStatus(bool isCompleted)
        {
            var tasks = await _service.GetByStatusAsync(isCompleted);
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var t = await _service.GetByIdAsync(id);
            return t is null ? NotFound() : Ok(t);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaskItem item)
        {
            if (string.IsNullOrWhiteSpace(item.Title))
                return BadRequest("Title required");

            // Đảm bảo trạng thái mặc định là false ("Đang làm")
            item.IsCompleted = false; 

            var created = await _service.CreateAsync(item);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TaskItem item)
        {
            var exist = await _service.GetByIdAsync(id);
            if (exist is null) return NotFound();

            exist.Title = item.Title;
            exist.DueDate = item.DueDate;
            exist.IsCompleted = item.IsCompleted;

            await _service.UpdateAsync(exist);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var exist = await _service.GetByIdAsync(id);
            if (exist is null) return NotFound();

            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}