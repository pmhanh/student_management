import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './schema/student.schema';
import * as dayjs from 'dayjs';
import { logInfo } from 'src/logger';
import { ConfigService } from '@nestjs/config';
import { StatusService } from 'src/status/status.service';

const phoneFormats: { [key: string]: RegExp } = {
    VN: /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/,

};
@Injectable()
export class StudentService {
    constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>,
                private readonly statusService: StatusService,
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
    
        const newStudent = new this.studentModel(studentData);
        const { studentId } = newStudent;
        logInfo('Thêm học sinh', `MSSV: ${studentId}`);
        return newStudent.save();
    }

    async getStudents(): Promise<Student[]> {
        return this.studentModel.find().populate('faculty program status').exec();
    }

    async getStudentById(studentId: string): Promise<Student | null> {
        return this.studentModel.findOne({ studentId }).populate('faculty program status').exec();
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
        return this.studentModel.findOneAndDelete({ studentId }).exec();
    }
}