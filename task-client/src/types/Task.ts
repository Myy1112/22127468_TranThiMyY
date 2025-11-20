// task-client/src/types/Task.ts

export interface TaskItem {
    id: number;
    title: string;
    dueDate: string | null; 
    isCompleted: boolean;
    createdAt: string;
}

export interface TaskCreateUpdate {
    title: string;
    dueDate: string | null;
    isCompleted: boolean;
}