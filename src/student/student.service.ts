import { Injectable, BadRequestException, Inject, NotFoundException, ForbiddenException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './schema/student.schema';
import * as dayjs from 'dayjs';
import { logInfo } from 'src/logger';
import { ConfigService } from '@nestjs/config';
import { StatusService } from 'src/status/status.service';
import jsPDF from 'jspdf';
import * as     path from 'path';
import * as fs from 'fs';
import { FacultyService } from 'src/faculty/faculty.service';
import { ProgramService } from 'src/program/program.service';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

// Kích hoạt plugin timezone và utc của dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
const phoneFormats: { [key: string]: RegExp } = {
    VN: /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/,

};
@Injectable()
export class StudentService {
    constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>,
                private readonly statusService: StatusService,
                @Inject(forwardRef(() => FacultyService)) private facultyService: FacultyService,
                private readonly programService: ProgramService,
                @Inject(ConfigService) private configService: ConfigService) {}

    async checkDuplicate(studentData: any): Promise<void> {
        const { studentId, email, phone } = studentData;
        console.log(studentId);
        const studentWithSameId = await this.studentModel.findOne({ studentId });
        if (studentWithSameId) {
            console.log(1);
            throw new BadRequestException('Mã số sinh viên đã tồn tại');
        }
    
        const studentWithSameEmail = await this.studentModel.findOne({ email });
        if (studentWithSameEmail && studentWithSameEmail.studentId !== studentId) {
            throw new BadRequestException('Email đã tồn tại');
        }

        const studentWithSamePhone = await this.studentModel.findOne({ phone });
        if (studentWithSamePhone && studentWithSamePhone.studentId !== studentId) {
            throw new BadRequestException('Số điện thoại đã tồn tại');
        }
    }
    async checkDuplicate1(studentData: any, studentIdcheck:string): Promise<void> {
        const {_, email, phone } = studentData;
    
        const studentWithSameEmail = await this.studentModel.findOne({ email });
        if (studentWithSameEmail && studentWithSameEmail.studentId !== studentIdcheck) {
            throw new BadRequestException('Email đã tồn tại');
        }

        const studentWithSamePhone = await this.studentModel.findOne({ phone });
        if (studentWithSamePhone && studentWithSamePhone.studentId !== studentIdcheck) {
            throw new BadRequestException('Số điện thoại đã tồn tại');
        }
    }

    private validatePhoneNumber(phone: string): void {
        const country = this.configService.get<string>('COUNTRY') || 'VN';
        console.log(country);
        const regex = phoneFormats[country];
        if (!regex) {
        throw new BadRequestException(`Quốc gia ${country} không nằm trong danh  sách số điện thoại`);
        }
        if (!regex.test(phone)) {
            console.log('sai');
            throw new BadRequestException(`Số điện thoại không hợp lệ cho quốc gia ${country}`);
        }
    }


    async createStudent(studentData: any): Promise<Student> {
        console.log('Student Data:', studentData); 
        console.log('Phone:', studentData.phone); 
    
        if (!studentData.phone) {
            console.log('Không có số điện thoại');
            throw new BadRequestException('Số điện thoại không được để trống');
        }
    
        this.validatePhoneNumber(studentData.phone);
        console.log('Số điện thoại hợp lệ');
    
        const allowedDomain = this.configService.get<string>('ALLOWED_EMAIL_DOMAIN');
        console.log('Allowed Domain:', allowedDomain);
        const domain = studentData.email.split('@')[1];
        if (domain !== allowedDomain) {
            throw new BadRequestException('Email không đúng định dạng');
        }
    
        await this.checkDuplicate(studentData);
        const newStudent = await this.studentModel.create(studentData);
        // const newStudent = new this.studentModel(studentData);
        const { studentId } = newStudent;
        logInfo('Thêm học sinh', `MSSV: ${studentId}`);
        return newStudent;//.save();
    }

    async getStudents(): Promise<Student[]> {
        return this.studentModel.find().populate('faculty program status').exec();
    }

    async getStudentById(studentId: string): Promise<Student | null> {
        return this.studentModel.findOne({ studentId }).populate('faculty program status').exec();
    }

    async getAllStudentInfo(studentId: string){
        const student = await this.studentModel
            .findOne({ studentId })
            .populate('faculty', 'name')  // Populate the faculty field with only the name
            .populate('program', 'name')  // Populate the program field with only the name
            .populate('status', 'name')  // Populate the status field with only the name
            .exec();
        return student;
    }
    async getStudentsWithPopulatedFields(): Promise<any[]> {
        const students = await this.studentModel
          .find()
          .populate('faculty', 'name')
          .populate('program', 'name')
          .populate('status', 'name')
          .exec();
        console.log(students);
        return students.map(student => {
          return {
            ...student.toObject(),
            faculty: student.faculty ? (student.faculty as any).name : null,
            program: student.program ? (student.program as any).name : null,
            status: student.status ? (student.status as any).name : null,
            birthDate: dayjs(student.birthDate).format('YYYY-MM-DD')
          };
        });
      }
    async findByFaculty(facultyId: string): Promise<Student[]> {
        return this.studentModel.find({ faculty: facultyId }).populate('faculty program status').exec();
    }

    async getStudentInFaculty(facultyId: string): Promise<Student[]> {
        return this.studentModel.find({faculty: facultyId}).exec();
    }
    async getStudentWithStatus(statusId: string): Promise<Student[]> {
        return this.studentModel.find({status: statusId}).exec();
    }

    async findByFacultyAndName(facultyName: string, name: string): Promise<Student[]> {
        return this.studentModel.find({ faculty: facultyName, fullName: { $regex: name, $options: 'i' } }).populate('faculty program status').exec();
    }

    private validateStatus(currentStatus: string, newStatus: string): void {
        const statusTransitions = JSON.parse(this.configService.get<string>('STATUS_TRANSITIONS') || '{}');
        const allowedTransitions = statusTransitions[currentStatus] || [];

        if (!allowedTransitions.includes(newStatus)) {
            throw new BadRequestException(
                `Không thể chuyển từ trạng thái "${currentStatus}" sang "${newStatus}"`
            );
        }
    }
    async updateStudent(studentId: string, updateData: Student): Promise<Student | null> {
        await this.checkDuplicate1(updateData, studentId);
        
        if (updateData.status) {
            const currentStudent = await this.studentModel.findOne({ studentId }).populate('status');
            if (!currentStudent) {
                throw new BadRequestException('Sinh viên không tồn tại');
            }
            console.info("hello");
            const statusId = updateData.status.toString();
            console.info("statusId:", statusId);
            
            const newStatusName = await this.statusService.getStatusNameById(statusId);
            const currentStatus = (currentStudent.status as any).name;
            
            console.info("current status: ", currentStatus);
            console.info("new status: ", newStatusName);
            this.validateStatus(currentStatus, newStatusName);
        }
        else 
        {
            console.info("1");
        }
        // console.log("update data: ");
        // console.log(updateData);
        // logInfo('Cập nhật học sinh', `MSSV: ${studentId}`);

        return this.studentModel.findOneAndUpdate({ studentId }, updateData, { new: true }).exec();
    }


    async deleteStudent(studentId: string): Promise<Student | null> {
        const student = await this.studentModel.findOne({studentId}).exec();
        if (!student)
            throw new NotFoundException('Không tìm thấy học sinh');
        const country = this.configService.get<string>('COUNTRY') || 'VN';
        const limitTime = this.configService.get<number>('DELETE_STUDENT_TIME') || 30;
        console.log('limit time: ',limitTime);
        console.log('student.createdAt.getTime(): ', student.createdAt.getTime());

        const now = new Date();
        console.log('now.getTime(): ', now.getTime());

        if (now.getTime() - student.createdAt.getTime() > limitTime*60*1000)
            throw new ForbiddenException(`Không thể xóa học sinh sau ${limitTime} phút khi tạo.`);
        else 
            return this.studentModel.findOneAndDelete({ studentId }).exec();
    }

    async exportMD(student: Student, purpose: string)
    {
        const folderPath = path.join('src', 'SinhvienInfo');
        let purposeS;
        if (purpose === 'vayvon')
            purposeS = 'Xác nhận đang học để vay vốn ngân hàng';
        else if (purpose === 'tamhoan')
            purposeS = 'Xác nhận làm thủ tục tạm hoãn nghĩa vụ quân sự';
        else 
            purposeS = 'Xác nhận làm hồ sơ xin việc / thực tập';
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const vietnamTimezone = 'Asia/Ho_Chi_Minh';
        const currentDate = dayjs().tz(vietnamTimezone).format('DD/MM/YYYY');
        const expirationDate = dayjs().tz(vietnamTimezone).add(1, 'month').format('DD/MM/YYYY');

        // Định dạng ngày sinh sinh viên theo múi giờ Việt Nam
        const birthDateVN = dayjs(student.birthDate).tz(vietnamTimezone).format('DD/MM/YYYY');
        const md =  `
# TRƯỜNG ĐẠI HỌC [Tên Trường]
**PHÒNG ĐÀO TẠO**

📍 Địa chỉ: 227 Nguyễn Văn Cừ, Quận 5, Tp.Hồ Chí Minh.

📞 Điện thoại: 0123456789 | 📧 Email: hcmus@school.edu.vn

---
### GIẤY XÁC NHẬN TÌNH TRẠNG SINH VIÊN

Trường Đại học Khoa học Tự nhiên xác nhận:

#### 1. Thông tin sinh viên:
- **Họ và tên:** ${student.fullName}
- **Mã số sinh viên:** ${student.studentId}
- **Ngày sinh:** ${birthDateVN}
- **Giới tính:** ${student.gender}
- **Khoa:** ${await this.facultyService.getName(student.faculty.id.toString())}
- **Chương trình đào tạo:** ${await this.programService.getProgramNameById(student.program.id.toString())}
- **Khóa:** ${student.course}

#### 2. Tình trạng sinh viên hiện tại:
- ${await this.statusService.getStatusNameById(student.status.id.toString())}

#### 3. Mục đích xác nhận:
- ${purposeS}

#### 4. Thời gian cấp giấy:
Giấy xác nhận có hiệu lực đến ngày: ${expirationDate}

---
📍 **Xác nhận của Trường Đại học Khoa học Tự nhiên.**

📅 Ngày cấp: ${currentDate}

🖋 **Trưởng Phòng Đào Tạo**
(Ký, ghi rõ họ tên, đóng dấu)
`;

        const filePath = path.join(folderPath, `Giay_Xac_Nhan_${student.studentId}.md`);

        // Ghi nội dung vào file Markdown
        try {
            fs.writeFileSync(filePath, md, 'utf8');
            console.log(filePath);
            return { message: `File đã được xuất thành công: ${filePath}` };
        } catch (error) {
            return { message: 'Đã xảy ra lỗi khi xuất file!' };
        }
    }

    async exportHTML(student: Student, purpose: string) {
        const folderPath = path.join('src', 'SinhvienInfo', 'html');
        let purposeS;
        if (purpose === 'vayvon')
            purposeS = 'Xác nhận đang học để vay vốn ngân hàng';
        else if (purpose === 'tamhoan')
            purposeS = 'Xác nhận làm thủ tục tạm hoãn nghĩa vụ quân sự';
        else 
            purposeS = 'Xác nhận làm hồ sơ xin việc / thực tập';
    
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    
        const vietnamTimezone = 'Asia/Ho_Chi_Minh';
        const currentDate = dayjs().tz(vietnamTimezone).format('DD/MM/YYYY');
        const expirationDate = dayjs().tz(vietnamTimezone).add(1, 'month').format('DD/MM/YYYY');
    
        const birthDateVN = dayjs(student.birthDate).tz(vietnamTimezone).format('DD/MM/YYYY');
    
        const html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Giấy Xác Nhận Tình Trạng Sinh Viên</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .header, .footer {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .content {
                    margin: 20px;
                }
                h1 {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                }
                .section-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 20px;
                }
                .section-content {
                    margin-left: 20px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN</h1>
                <p><strong>PHÒNG ĐÀO TẠO</strong></p>
                <p>📍 Địa chỉ: 227 Nguyễn Văn Cừ, Quận 5, Tp.Hồ Chí Minh.</p>
                <p>📞 Điện thoại: 0123456789 | 📧 Email: hcmus@school.edu.vn</p>
            </div>
            
            <div class="content">
                <h2>GIẤY XÁC NHẬN TÌNH TRẠNG SINH VIÊN</h2>
                <p>Trường Đại học Khoa học Tự nhiên xác nhận:</p>
    
                <div class="section-title">1. Thông tin sinh viên:</div>
                <div class="section-content">
                    <p><strong>Họ và tên:</strong> ${student.fullName}</p>
                    <p><strong>Mã số sinh viên:</strong> ${student.studentId}</p>
                    <p><strong>Ngày sinh:</strong> ${birthDateVN}</p>
                    <p><strong>Giới tính:</strong> ${student.gender}</p>
                    <p><strong>Khoa:</strong> ${await this.facultyService.getName(student.faculty.id.toString())}</p>
                    <p><strong>Chương trình đào tạo:</strong> ${await this.programService.getProgramNameById(student.program.id.toString())}</p>
                    <p><strong>Khóa:</strong> ${student.course}</p>
                </div>
    
                <div class="section-title">2. Tình trạng sinh viên hiện tại:</div>
                <div class="section-content">
                    <p>${await this.statusService.getStatusNameById(student.status.id.toString())}</p>
                </div>
    
                <div class="section-title">3. Mục đích xác nhận:</div>
                <div class="section-content">
                    <p>${purposeS}</p>
                </div>
    
                <div class="section-title">4. Thời gian cấp giấy:</div>
                <div class="section-content">
                    <p>Giấy xác nhận có hiệu lực đến ngày: ${expirationDate}</p>
                </div>
    
                <div class="footer">
                    <p>📍 Xác nhận của Trường Đại học Khoa học Tự nhiên.</p>
                    <p>📅 Ngày cấp: ${currentDate}</p>
                    <p>🖋 Trưởng Phòng Đào Tạo</p>
                    <p>(Ký, ghi rõ họ tên, đóng dấu)</p>
                </div>
            </div>
        </body>
        </html>
        `;
    
        const filePath = path.join(folderPath, `Giay_Xac_Nhan_${student.studentId}.html`);
    
        try {
            fs.writeFileSync(filePath, html, 'utf8');
            console.log(filePath);
            return { message: `File HTML đã được xuất thành công: ${filePath}` };
        } catch (error) {
            return { message: 'Đã xảy ra lỗi khi xuất file!' };
        }
    }
    
}
