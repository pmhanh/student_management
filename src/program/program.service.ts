import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { Program, ProgramDocument } from './program.schema';
import {Model} from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { logInfo } from 'src/logger';
import { promises } from 'dns';
import { StudentService } from 'src/student/student.service';
@Injectable()
export class ProgramService {
    constructor(@InjectModel(Program.name) private programModel: Model<ProgramDocument>,
                @Inject(forwardRef(() => StudentService)) private studentService: StudentService,) {}
    

    async createProgram(programData: string): Promise<Program>{
        const newProgram = new this.programModel(programData);

        const {name} = newProgram;
        logInfo('Thêm chương trình', `Tên: ${name}` );
        return newProgram.save();
    }

    async findAll(): Promise<Program[]> {
        return this.programModel.find().exec();
    }

    async findOne(name: string): Promise<Program | null> {
        return this.programModel.findOne({name}).exec();
    }

    async update(name: string, newStatusName: string): Promise<Program | null> {
        const status = await this.programModel.findOne({ name }).exec();                                                                                                           
        
        if (!status) {
            console.log("sai");
            throw new NotFoundException("Chương trình đạo tạo không tồn tại");
        }
        else
        {
            logInfo('Cập nhật chương trình học', `Tên: ${name}` );
            status.name = newStatusName;
            return await status.save();
        }
    }
    async findByName(name: string) {
        const program = await this.programModel.findOne({ name }).exec();
        if (!program) {
            throw new NotFoundException(`Program with name ${name} not found`);
        }
        return program;
    }

    async getProgramNameById(programId: string): Promise<string>{
        const status = await this.programModel.findById(programId).exec();
        if (!status)
            throw new NotFoundException('Không tìm thấy chương trình đào tạo');
        return status.name;
    }

    async deleteProgramByName(programName: string): Promise<any>{
        const program = await this.findByName(programName);
        console.log('program: ',program);
        
        const studentWithStatus = await this.studentService.getStudentWithProgram(program.id);
        console.log(studentWithStatus);
        if (studentWithStatus.length > 0) {
            throw new ForbiddenException('Không thể xóa trạng thái vì có sinh viên đang ở trạng thái này.');
        }
        return this.programModel.findOneAndDelete({ name: programName }).exec();
    }
}
