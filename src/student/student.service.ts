import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './schema/student.schema';

@Injectable()
export class StudentService {
    constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>) {}

    async checkDuplicate(studentData: any): Promise<void> {
        const { studentId, email, phone } = studentData;
    
        const studentWithSameId = await this.studentModel.findOne({ studentId });
        if (studentWithSameId) {
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
    async createStudent(studentData: any): Promise<Student> {
        await this.checkDuplicate(studentData);
        const newStudent = new this.studentModel(studentData);
        return newStudent.save();
    }

    // async getStudents(): Promise<Student[]> {
    //     return this.studentModel.find().exec();
    // }

    // async getStudentById(studentId: string): Promise<Student | null> {
    //     return this.studentModel.findOne({ studentId }).exec();
    // }

    async getStudents(): Promise<Student[]> {
        return this.studentModel.find().populate('faculty program status').exec();
    }

    async getStudentById(studentId: string): Promise<Student | null> {
        return this.studentModel.findOne({ studentId }).populate('faculty program status').exec();
    }

    async findByFaculty(facultyId: string): Promise<Student[]> {
        return this.studentModel.find({ faculty: facultyId }).populate('faculty program status').exec();
    }

    async findByFacultyAndName(facultyName: string, name: string): Promise<Student[]> {
        return this.studentModel.find({ faculty: facultyName, fullName: { $regex: name, $options: 'i' } }).populate('faculty program status').exec();
    }

    async updateStudent(studentId: string, updateData: any): Promise<Student | null> {
        await this.checkDuplicate1(updateData, studentId);
        return this.studentModel.findOneAndUpdate({ studentId }, updateData, { new: true }).exec();
    }


    async deleteStudent(studentId: string): Promise<Student | null> {
        return this.studentModel.findOneAndDelete({ studentId }).exec();
    }
}
