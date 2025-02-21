import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Program, ProgramDocument } from './program.schema';
import {Model} from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProgramService {
    constructor(@InjectModel(Program.name) private programModel: Model<ProgramDocument>) {}

    async createProgram(programData: string): Promise<Program>{
        const newProgram = new this.programModel(programData);
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
            status.name = newStatusName;
            return await status.save();
        }
    }
}
