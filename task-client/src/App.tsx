// task-client/src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { taskApi } from './api/taskApi';
import { TaskItem, TaskCreateUpdate } from './types/Task';
import { FaTrash, FaPen, FaCalendarAlt } from 'react-icons/fa'; // Dùng FaPen cho giống mẫu

// --- GIỮ NGUYÊN LOGIC CŨ ---
const INITIAL_FORM_STATE: TaskCreateUpdate & { id?: number } = {
    title: '',
    dueDate: '',
    isCompleted: false,
};

const App: React.FC = () => {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'active'>('all');
    const [form, setForm] = useState<TaskCreateUpdate & { id?: number }>(INITIAL_FORM_STATE);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const API_PORT = 5001;

    const fetchTasks = useCallback(async (status: 'all' | 'completed' | 'active') => {
        setLoading(true);
        setError(null);
        try {
            let data: TaskItem[];
            if (status === 'all') {
                data = await taskApi.getAll();
            } else {
                const isCompleted = status === 'completed';
                data = await taskApi.getByStatus(isCompleted);
            }
            setTasks(data);
        } catch (err) {
            console.error(err);
            setError(`Lỗi kết nối Backend (Port ${API_PORT}).`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks(filterStatus);
    }, [filterStatus, fetchTasks]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) return;

        try {
            if (isEditing && form.id !== undefined) {
                const updatedTask: TaskItem = {
                    id: form.id,
                    title: form.title,
                    dueDate: form.dueDate || null,
                    isCompleted: form.isCompleted,
                    createdAt: new Date().toISOString(),
                };
                await taskApi.update(updatedTask);
            } else {
                const newTask: TaskCreateUpdate = {
                    title: form.title,
                    dueDate: form.dueDate || null,
                    isCompleted: false,
                };
                await taskApi.create(newTask);
            }
            setForm(INITIAL_FORM_STATE);
            setIsEditing(false);
            fetchTasks(filterStatus);
        } catch (err) {
            setError("Lỗi khi lưu task.");
        }
    };

    const handleEdit = (task: TaskItem) => {
        setForm({
            id: task.id,
            title: task.title,
            dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
            isCompleted: task.isCompleted,
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Xóa task này?')) return;
        try {
            await taskApi.remove(id);
            fetchTasks(filterStatus);
        } catch (err) {
            setError("Lỗi xóa.");
        }
    };

    const handleToggleComplete = async (task: TaskItem) => {
        try {
            const updatedTask = { ...task, isCompleted: !task.isCompleted };
            await taskApi.update(updatedTask);
            fetchTasks(filterStatus);
        } catch (err) {
            console.error(err);
        }
    };

    // --- PHẦN UI ĐÃ ĐƯỢC SỬA LẠI GIỐNG MẪU ---
    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white w-full max-w-3xl rounded-[30px] shadow-xl p-8 md:p-12">
                
                {/* Header */}
                <h1 className="text-3xl md:text-4xl font-bold text-center text-[#0f172a] mb-10 tracking-tight">
                    Màn hình quản lý task <br /> cá nhân
                </h1>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {/* Form Input Group */}
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mb-8">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            name="title"
                            placeholder="Task"
                            value={form.title}
                            onChange={handleFormChange}
                            className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600 placeholder-gray-400"
                        />
                    </div>
                    
                    <div className="relative md:w-48">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <FaCalendarAlt />
                        </div>
                        <input
                            type="date"
                            name="dueDate"
                            placeholder="Due-date"
                            value={form.dueDate || ''}
                            onChange={handleFormChange}
                            className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`px-8 py-3 rounded-lg font-semibold text-white transition-all shadow-md hover:shadow-lg ${isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#2563EB] hover:bg-blue-700'}`}
                    >
                        {isEditing ? 'Update' : 'Add'}
                    </button>
                    
                    {isEditing && (
                        <button 
                            type="button"
                            onClick={() => {setIsEditing(false); setForm(INITIAL_FORM_STATE)}}
                            className="px-4 py-3 bg-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-300"
                        >
                            Hủy
                        </button>
                    )}
                </form>

                {/* Filter Button (Style giống dropdown) */}
                <div className="mb-6">
                    <div className="relative inline-block">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="appearance-none bg-white border border-yellow-400 text-gray-800 font-medium py-2 pl-4 pr-10 rounded-lg cursor-pointer focus:outline-none hover:bg-yellow-50"
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Đang làm</option>
                            <option value="completed">Hoàn thành</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {/* Task List (Dạng bảng) */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-800 border-b border-gray-100">
                                <th className="py-4 font-bold text-base w-1/2 pl-2">Task</th>
                                <th className="py-4 font-bold text-base w-1/4">Due-date</th>
                                <th className="py-4 font-bold text-base w-1/4 text-center">Status</th>
                                <th className="py-4 w-10"></th> 
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-400">Đang tải...</td></tr>
                            ) : tasks.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-400">Chưa có task nào.</td></tr>
                            ) : (
                                tasks.map((task) => (
                                    <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                        {/* Cột Tên Task */}
                                        <td className="py-4 pl-2 font-semibold text-gray-800 align-middle">
                                            {task.title}
                                        </td>

                                        {/* Cột Ngày hạn */}
                                        <td className="py-4 text-gray-500 align-middle">
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB') : '—'}
                                        </td>

                                        {/* Cột Trạng thái (Badge) */}
                                        <td className="py-4 text-center align-middle">
                                            <button 
                                                onClick={() => handleToggleComplete(task)}
                                                className={`px-3 py-1.5 rounded text-white text-sm font-medium transition-colors whitespace-nowrap ${
                                                    task.isCompleted 
                                                    ? 'bg-[#34D399] hover:bg-green-500'  // Màu xanh lá
                                                    : 'bg-[#3B82F6] hover:bg-blue-600'   // Màu xanh dương
                                                }`}
                                            >
                                                {task.isCompleted ? 'Hoàn thành' : 'Đang làm'}
                                            </button>
                                        </td>

                                        {/* Cột Hành động (Edit/Delete Icon) */}
                                        <td className="py-4 text-right align-middle pr-2">
                                            <div className="flex justify-end gap-3">
                                                {/* Nút sửa (màu vàng) */}
                                                <button 
                                                    onClick={() => handleEdit(task)}
                                                    className="text-yellow-400 hover:text-yellow-500 p-1 transition-transform hover:scale-110"
                                                >
                                                    <FaPen size={16} />
                                                </button>
                                                {/* Nút xóa (màu cam/đỏ) */}
                                                <button 
                                                    onClick={() => handleDelete(task.id)}
                                                    className="text-orange-400 hover:text-red-500 p-1 transition-transform hover:scale-110"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default App;