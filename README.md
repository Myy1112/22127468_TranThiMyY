# ỨNG DỤNG QUẢN LÝ TASK CÁ NHÂN (Personal Task Manager)

## 1. Giới thiệu dự án
Dự án là một ứng dụng quản lý task cá nhân (Personal Task Manager) được xây dựng với kiến trúc Client-Server, cho phép người dùng thực hiện các thao tác quản lý công việc cơ bản.

### Chức năng chính
* **Thêm** task mới (tên, ngày hết hạn, trạng thái mặc định "Đang làm").
* **Hiển thị** danh sách task.
* **Cập nhật** trạng thái hoặc nội dung task.
* **Xóa** task.
* **Lọc** danh sách task theo trạng thái (Đang làm / Hoàn thành).

### Công nghệ sử dụng
| Thành phần | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Backend** | **ASP.NET Core Web API (.NET 8)** | Sử dụng Entity Framework Core, Pomelo MySQL Provider.Kiến trúc: Controller, Service, Repository[cite: 28]. |
| **Database** | **MySQL (Version 8.0)** | Được chạy qua Docker. |
| **Frontend** | **React** (sử dụng Vite) | Gọi API bằng Axios. |

***

## 2. Hướng dẫn chạy dự án

Dự án được khuyến nghị chạy bằng **Docker Compose** để khởi động cả Database và Web API một cách đồng bộ.

### Yêu cầu
Cần cài đặt **Docker** và **Docker Compose** trên máy tính.

### Cấu hình môi trường

| Thành phần | Đường dẫn thư mục | Cổng (Port) | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Database (MySQL)** | `TaskApi/` | **3306** (Local) | Tên DB: `taskdb`, User: `root`, Pass: `password`. |
| **Web API (`TaskApi`)** | `TaskApi/` | **5001** (Local)| Endpoint: `http://localhost:5001/api/Tasks`. |
| **React App (`task-client`)** | `task-client/` | **5173** (Mặc định Vite)  | Tự động kết nối đến API: `http://localhost:5001`. |

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
    ```
4.  Khởi động ứng dụng Frontend:
    ```bash
    npm run dev
    ```
5.  Ứng dụng sẽ mở trên trình duyệt tại địa chỉ được hiển thị trên console (thường là **http://localhost:5173/**).

***

## 3. Cấu hình chi tiết (DB và API)

### 3.1. Cấu hình Database
* **Host API truy cập**: `mysql_db` (Tên service trong Docker Compose ).
* **Cổng**: `3306`.
* **Database Name**: `taskdb`.
* **User**: `root`.
* **Password**: `password`.

(Các thông số này được định nghĩa trong `TaskApi/docker-compose.yml` và `TaskApi/appsettings.json`).

### 3.2. Cấu hình Web API
* **Cổng API bên trong Docker**: `8080`.
* **Cổng API bên ngoài (Local)**: `5001`.
* **Base URL cho Frontend**: `http://localhost:5001/api/Tasks`.
* **Cổng chạy Debug/Visual Studio (Không dùng Docker)**: `http://localhost:5252` (HTTP) và `https://localhost:7041` (HTTPS).

**Ghi chú:** Frontend đã được cấu hình cố định để gọi API tại `http://localhost:5001`.
