import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/student.dto';
import { BadRequestException } from '@nestjs/common';

@Controller('students')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post()
    async create(@Body() studentData: CreateStudentDto) {
        try {
            console.log(studentData);
            return await this.studentService.createStudent(studentData);
        } catch (error) {
            if (error.response && error.response.message) {
                throw new BadRequestException(error.response.message);
            }
            throw new BadRequestException('Dữ liệu nhập không hợp lệ.');
        }
    }

    @Get()
    findAll() {
        return this.studentService.getStudents();
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
    remove(@Param('studentId') studentId: string) {
        return this.studentService.deleteStudent(studentId);
    }
}
