## Version 1.0
### Frontend: folder page

- home.html: Trang chủ của ứng dụng với các liên kết đến các trang tìm kiếm, thêm sinh viên, xóa sinh viên, cập nhật sinh viên.
- searchStudent.html: Tìm kiếm sinh viên theo MSSV.
- addStudent.html: Thêm sinh viên.
- deleteStudent.html: xóa sinh viên theo MSSV.
- updateStudent.html: cập nhât sinh vien theo MSSV.
- styles.css: CSS dùng cho giao diện.

### Backend: folder source
Dùng NestJS, TypeScript và mongoDB 
- controller: Chứa các controller, định nghĩa các endpoint để xử lý các yêu cầu từ frontend.
- service: Chứa các logic xử lý dữ liệu như tạo sinh viên, cập nhật, xóa, và tìm kiếm sinh viên.
- schema: Định nghĩa các schema của MongoDB cho sinh viên.
- dto: Data Transfer Objects dùng để xác định cấu trúc dữ liệu khi nhận hoặc trả về dữ liệu.

### Database:
- Sử dụng MongoDB để lưu trữ dữ liệu
  
### Ảnh: folder screenshots Chứa hình ảnh minh chứng
- Trang chủ
![Trang chủ](screenshots/homepage.png)
- Giao diện thêm sinh viên mới
![Giao diện thêm sinh viên mới](screenshots/addStudent.PNG)
- Thêm sinh viên mới
![Thêm sinh viên mới](screenshots/demoAddStudent.PNG)
- Giao diện xóa sinh viên
![Giao diện xóa sinh viên](screenshots/deleteStudent.PNG)
- Xóa sinh viên
![Xóa sinh viên](screenshots/demoDeleteStudent.PNG)
- Giao diện tìm kiếm sinh viên
![Giao diện tìm kiếm sinh viên](screenshots/findStudent.PNG)
- Tìm kiếm sinh viên
![Tìm kiếm sinh viên](screenshots/demoFindStudent.PNG)
- Giao diên cập nhật sinh viên
![Giao diên cập nhật sinh viên](screenshots/updateStudent.PNG)
- Cập nhật sinh viên
![Cập nhật sinh viên](screenshots/demoUpdateStudent.PNG)
## Cài Đặt và Chạy Ứng Dụng

### 1. Cài Đặt Backend

   - Điều hướng vào thư mục `backend`:
     cd student-management

     npm install


1. **Chạy Backend**:
   - Sử dụng lệnh sau để chạy ứng dụng backend:
     npm run start
   - Web sẽ được chạy trên `http://localhost:3000`.

### 2. **Cài Đặt Frontend**

1. Chỉ cần mở file `home.html` 
2. Go Live để chạy trang home. 

## Version 2.0

### Code
- Thêm các bảng faculty, status, program để có thể thêm hoặc thay đổi tên khoa, chương trình và trạng thái học sinh.

### Ảnh minh chứng

- Thêm mới khoa 
![Program](screenshots/addFaculty.png)
- Đổi tên khoa
![Program](screenshots/changeFaculty.png)

- Thêm trạng thái học sinh
![Statua](screenshots/addStatus.png)
- Đổi trạng thái học sinh
![Status](screenshots/changeStatus.png)
- Thêm mới chương trình đào tạo
![Program](screenshots/demoProgram.png)
- Đổi tên chương trình đào tạo
![Program](screenshots/changeProgram.png)


- Giao diện tìm kiếm
![Search](screenshots/search.png)
- Tìm kiếm theo khoa
- ![Search](screenshots/searchFaculty.png.png)
- Tìm kiếm theo tên khoa + tên sinh viên
![Search](screenshots/searchFacultyAndName.png.png)

- File excel, json
![Import](screenshots/import.png)
- Import file excel
![Import excel](screenshots/importExcel.png)
![Import excel](screenshots/importExcelResult.png.png)
- Import file JSON
![Import json](screenshots/studentJson.png.png)
![Import json](screenshots/importJson.png.png.png)

- Export file
![Export](screenshots/exportFile.png)
- Export file excel
![Export excel](screenshots/exportExcel.png.png)
- Export file JSON
![Export json](screenshots/exportJSON.png)

- Logging mechanism
![Logging](screenshots/logging.png)
- Version và ngày build ứng dụng
![Version + build date](screenshots/version_build.png)

### Deadline
- Hoàn thành trễ phần tìm kiếm, import/export file excel/JSON, logging mechanism và hiển thị version.