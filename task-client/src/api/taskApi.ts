// task-client/src/api/taskApi.ts

import axios from 'axios';
import { TaskItem, TaskCreateUpdate } from '../types/Task';

// 💡 Cổng API đã được fix thành 5001
const API_BASE_URL = 'http://localhost:5001/api/Tasks'; 

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const taskApi = {
    // GET: Lấy TẤT CẢ task
    getAll: async (): Promise<TaskItem[]> => {
        const response = await apiClient.get<TaskItem[]>('/');
        return response.data;
    },

    // GET: Lọc task theo trạng thái (true/false)
    getByStatus: async (isCompleted: boolean): Promise<TaskItem[]> => {
        // Endpoint: /api/Tasks/status/true hoặc /api/Tasks/status/false
        const response = await apiClient.get<TaskItem[]>(`/status/${isCompleted}`);
        return response.data;
    },

    // POST: Tạo task mới
    create: async (task: TaskCreateUpdate): Promise<TaskItem> => {
        const response = await apiClient.post<TaskItem>('/', task);
        return response.data;
    },

    // PUT: Cập nhật task
    update: async (task: TaskItem): Promise<void> => {
        await apiClient.put<void>(`/${task.id}`, task);
    },

    // DELETE: Xóa task
    remove: async (id: number): Promise<void> => {
        await apiClient.delete<void>(`/${id}`);
    }
};