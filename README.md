# ỨNG DỤNG QUẢN LÝ TASK CÁ NHÂN (Personal Task Manager)

## 1. Giới thiệu dự án
Dự án là một ứng dụng quản lý task cá nhân (Personal Task Manager) được xây dựng với kiến trúc Client-Server, cho phép người dùng thực hiện các thao tác quản lý công việc cơ bản.

### Chức năng chính
* [cite_start]**Thêm** task mới (tên, ngày hết hạn, trạng thái mặc định "Đang làm")[cite: 34].
* [cite_start]**Hiển thị** danh sách task[cite: 35].
* [cite_start]**Cập nhật** trạng thái hoặc nội dung task[cite: 36].
* [cite_start]**Xóa** task[cite: 37].
* [cite_start]**Lọc** danh sách task theo trạng thái (Đang làm / Hoàn thành)[cite: 5, 38].

### Công nghệ sử dụng
| Thành phần | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Backend** | **ASP.NET Core Web API (.NET 8)** | [cite_start]Sử dụng Entity Framework Core, Pomelo MySQL Provider[cite: 25, 27]. [cite_start]Kiến trúc: Controller, Service, Repository[cite: 28]. |
| **Database** | **MySQL (Version 8.0)** | [cite_start]Được chạy qua Docker[cite: 29]. |
| **Frontend** | **React** (sử dụng Vite) | [cite_start]Gọi API bằng Axios[cite: 30, 31]. |

***

## 2. Hướng dẫn chạy dự án

Dự án được khuyến nghị chạy bằng **Docker Compose** để khởi động cả Database và Web API một cách đồng bộ.

### Yêu cầu
Cần cài đặt **Docker** và **Docker Compose** trên máy tính.

### Cấu hình môi trường

| Thành phần | Đường dẫn thư mục | Cổng (Port) | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Database (MySQL)** | `TaskApi/` | [cite_start]**3306** (Local) [cite: 1, 29] | [cite_start]Tên DB: `taskdb`, User: `root`, Pass: `password`[cite: 1]. |
| **Web API (`TaskApi`)** | `TaskApi/` | [cite_start]**5001** (Local) [cite: 1, 6] | [cite_start]Endpoint: `http://localhost:5001/api/Tasks`[cite: 6]. |
| **React App (`task-client`)** | `task-client/` | [cite_start]**5173** (Mặc định Vite) [cite: 5] | [cite_start]Tự động kết nối đến API: `http://localhost:5001`[cite: 6]. |

### Các bước thực hiện

#### 1. Khởi động Database và Backend (TaskApi)

1.  Mở Terminal hoặc Command Prompt.
2.  Di chuyển đến thư mục chứa file `docker-compose.yml` (thường là thư mục **`TaskApi/`**).
3.  Chạy lệnh sau để build image và khởi động các container (`mysql_db` và `taskapi`):
    ```bash
    docker-compose up --build
    ```
    * Database MySQL sẽ được khởi tạo và chạy trên cổng **3306**.
    * Web API sẽ chạy trên cổng **5001** và tự động kết nối, tạo schema trong MySQL.
4.  Đợi cho đến khi container `task_api` báo đã chạy thành công. Bạn có thể kiểm tra API tại **Swagger UI**: `http://localhost:5001/swagger/index.html`.

#### 2. Khởi động Frontend (React App)

1.  Mở Terminal hoặc Command Prompt **mới**.
2.  Di chuyển đến thư mục của React app (**`task-client/`**).
3.  Cài đặt dependencies:
    ```bash
    npm install
    # hoặc yarn install
    ```
4.  Khởi động ứng dụng Frontend:
    ```bash
    npm run dev
    # hoặc yarn dev
    ```
5.  Ứng dụng sẽ mở trên trình duyệt tại địa chỉ được hiển thị trên console (thường là **http://localhost:5173/**).

***

## 3. Cấu hình chi tiết (DB và API)

### 3.1. Cấu hình Database
* [cite_start]**Host API truy cập**: `mysql_db` (Tên service trong Docker Compose [cite: 1]).
* [cite_start]**Cổng**: `3306`[cite: 1, 2].
* [cite_start]**Database Name**: `taskdb`[cite: 1, 2].
* [cite_start]**User**: `root`[cite: 1, 2].
* [cite_start]**Password**: `password`[cite: 1, 2].

(Các thông số này được định nghĩa trong `TaskApi/docker-compose.yml` và `TaskApi/appsettings.json`).

### 3.2. Cấu hình Web API
* [cite_start]**Cổng API bên trong Docker**: `8080`[cite: 1].
* [cite_start]**Cổng API bên ngoài (Local)**: `5001`[cite: 1].
* [cite_start]**Base URL cho Frontend**: `http://localhost:5001/api/Tasks`[cite: 6].
* [cite_start]**Cổng chạy Debug/Visual Studio (Không dùng Docker)**: `http://localhost:5252` (HTTP) và `https://localhost:7041` (HTTPS)[cite: 3, 4].

**Ghi chú:** Frontend đã được cấu hình cố định để gọi API tại `http://localhost:5001`.
