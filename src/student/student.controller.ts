import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/student.dto';
import { BadRequestException } from '@nestjs/common';
import { logError } from 'src/logger';
import { FacultyService } from 'src/faculty/faculty.service';

@Controller('students')
export class StudentController {
    constructor(private readonly studentService: StudentService,
    ) {}

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
    @Get(':studentId/confirmation')
    async getConfirmation(@Param('studentId') studentId: string, @Query('format') format: string, @Query('purpose') purpose: string){
        console.log('purpose', purpose)

        const student = await this.studentService.getAllStudentInfo(studentId);
        if (!student)
            throw new BadRequestException('Sinh viên không tồn tại')
        if (format === 'pdf'){
            return this.studentService.exportHTML(student, purpose);
        }
        else if (format === 'md')
            return this.studentService.exportMD(student, purpose);
        else throw new BadRequestException('Định dạng không hợp lệ.');
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