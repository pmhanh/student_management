import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { Faculty, FacultyDocument } from './faculty.schema';
import {Model} from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { logInfo } from 'src/logger';
import { Student, StudentDocument } from 'src/student/schema/student.schema';
import { StudentService } from 'src/student/student.service';
@Injectable()
export class FacultyService {
    constructor(@InjectModel(Faculty.name) private facultyModel: Model<FacultyDocument>,
                // private readonly studentService: StudentService,
                @Inject(forwardRef(() => StudentService)) private studentService: StudentService,
            ) {}

    async createFaculty(facultyData: string): Promise<Faculty>{
        const newFaculty = new this.facultyModel(facultyData);
        const {name} = newFaculty;
        logInfo('Thêm khoa', `Tên: ${name}'` );

        return newFaculty.save();
    }

    async getName(facultyId: string) {
        const faculty = await this.facultyModel.findById(facultyId).exec(); // Directly pass the facultyId
        return faculty?.name;
    }
    
    async findAll(): Promise<FacultyDocument[]> {
        const faculties = this.facultyModel.find().exec();
        console.log(faculties)
        return faculties;
    }

    async findOne(name: string): Promise<Faculty | null> {
        return this.facultyModel.findOne({name}).exec();

    }

    async update(name: string, newFacultyName: string): Promise<Faculty | null> {
        const faculty = await this.facultyModel.findOne({ name }).exec();
        
        if (!faculty) {
            console.log("sai");
            throw new NotFoundException("Khoa không tồn tại");
        }
        else
        {
            logInfo('Cập nhật tên khoa', `Tên cũ: ${name} - tên mới: ${newFacultyName}'` );
            faculty.name = newFacultyName;
            const updatedFaculty = await faculty.save();
        
            return updatedFaculty;
        }
    }
    async findByName(name: string) {
        const faculty = await this.facultyModel.findOne({ name }).exec();
        if (!faculty) {
            throw new NotFoundException(`Faculty with name ${name} not found`);
        }
        return faculty;
    }

    async deleteFacultyByName(facultyName: string): Promise<any> {
        // const faculty = await this.facultyModel.findOne({ name: facultyName }).exec();
        // if (!faculty) {
        //     throw new NotFoundException('Khoa không tồn tại');
        // }
        const faculty = await this.findByName(facultyName);
        console.log('faculty: ',faculty);
        // const studentInFaculty = await this.studentModel.find({ faculty: faculty._id }).exec();
        const studentInFaculty = await this.studentService.getStudentInFaculty(facultyName);
        console.log(studentInFaculty);
        if (studentInFaculty.length > 0) {
            throw new ForbiddenException('Không thể xóa khoa này vì có sinh viên đang học');
        }
        return this.facultyModel.findOneAndDelete({ name: facultyName }).exec();
    }
    
}