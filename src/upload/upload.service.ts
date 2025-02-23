import { Injectable, BadRequestException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import { StudentService } from '../student/student.service';
import { CreateStudentDto } from 'src/student/dto/student.dto';
import { FacultyService } from 'src/faculty/faculty.service';
import { ProgramService } from 'src/program/program.service';
import { StatusService } from 'src/status/status.service';
import { FacultyDocument } from 'src/faculty/faculty.schema';
import { ProgramDocument } from 'src/program/program.schema';
import { error } from 'console';


@Injectable()
export class UploadService {
    constructor(private readonly studentService: StudentService,
        private readonly facultyService: FacultyService, 
        private readonly programService: ProgramService,
        private readonly statusService: StatusService,
    ) {}

    async uploadStudents(filePath: string): Promise<void> {
        const fileExtension = filePath.split('.').pop();
        let students: CreateStudentDto[];
        console.log(fileExtension);
        if (fileExtension === 'xlsx') {
            students = this.parseExcel(filePath);
        } else if (fileExtension === 'json') {
            students = this.parseJson(filePath);
        } else {
            throw new BadRequestException('Unsupported file type');
        }
        const faculties = await this.facultyService.findAll(); //as FacultyDocument[];
        for (const student of students) {
            try {

                // const name = student.faculty._id;
                // console.log(name);
                // const test  = await this.facultyService.findByName(name);
                // console.log(test);
                //student.faculty = await this.facultyService.findByName(name);
                // student.faculty = await this.getFacultyIdByName(student.faculty);
                // student.program = await this.getProgramIdByName(student.program);
                // student.status = await this.getStatusIdByName(student.status);
                console.log(student.faculty);
                await this.studentService.createStudent(student);
            } catch (error) {
            if (error instanceof BadRequestException && error.message.includes('Mã số sinh viên đã tồn tại')) {
                continue;
            } else {
                throw error;
            }
            }
        }
    }

    private parseExcel(filePath: string): CreateStudentDto[] {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_json(sheet);
    }

    private parseJson(filePath: string): CreateStudentDto[] {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    }

    // private async getFacultyIdByName(name: string): Promise<ObjectId> {
    //     const faculty = await this.facultyService.findByName(name);
    //     if (!faculty) {
    //         throw new BadRequestException(`Faculty with name ${name} not found`);
    //     }
    //     return faculty._id;
    // }

    // private async getProgramIdByName(name: string): Promise<string> {
    //     const program = await this.programService.findByName(name);
    //     if (!program) {
    //         throw new BadRequestException(`Program with name ${name} not found`);
    //     }
    //     return program._id.toString();
    // }

    // private async getStatusIdByName(name: string): Promise<string> {
    //     const status = await this.statusService.findByName(name);
    //     if (!status) {
    //         throw new BadRequestException(`Status with name ${name} not found`);
    //     }
    //     return status._id.toString();
    // }

    async exportStudentToJson(): Promise<string> {
        const students = await this.studentService.getStudentsWithPopulatedFields();
        const jsonFilePath = './exports/students.json';
        fs.writeFileSync(jsonFilePath, JSON.stringify(students, null, 2), 'utf-8');
        return jsonFilePath;
      }
    
      async exportStudentToExcel(): Promise<string> {
        const students = await this.studentService.getStudentsWithPopulatedFields();
        const worksheet = xlsx.utils.json_to_sheet(students);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Students');
        const excelFilePath = './exports/students.xlsx';
        xlsx.writeFile(workbook, excelFilePath);
        return excelFilePath;
      }
}