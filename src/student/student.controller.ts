import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/student.dto';
import { BadRequestException } from '@nestjs/common';
import { logError } from 'src/logger';

@Controller('students')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post()
    async create(@Body() studentData: CreateStudentDto) {
        try {
            console.log("1");
            console.log(studentData);
            return await this.studentService.createStudent(studentData);
        } catch (error) {
            if (error.response && error.response.message) {
                logError('Lỗi khi thêm học sinh: ', error.response.message);
                throw new BadRequestException(error.response.message);
            }
            throw new BadRequestException('Dữ liệu nhập không hợp lệ.');
        }
    }

    @Get()
    find(@Query('faculty') faculty?: string, @Query('name') name?: string) {
        if (faculty && name) {
            return this.studentService.findByFacultyAndName(faculty, name);
        } else if (faculty) {
            return this.studentService.findByFaculty(faculty);
        } else {
            return this.studentService.getStudents();
        }
    }

    @Get(':studentId')
    findOne(@Param('studentId') studentId: string) {
        return this.studentService.getStudentById(studentId);
    }

    
    @Put(':studentId')
    update(@Param('studentId') studentId: string, @Body() updateData: any) {
        return this.studentService.updateStudent(studentId, updateData);
    }

    @Delete(':studentId')
    async remove(@Param('studentId') studentId: string) {
        try {
            await this.studentService.deleteStudent(studentId);
            return { message: 'Sinh viên đã được xóa.' };
        } catch (error) {
            throw new BadRequestException(error.message || 'Không thể xóa sinh viên.');
        }
    }
}