import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Faculty, FacultyDocument } from './faculty.schema';
import {Model} from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FacultyService {
    constructor(@InjectModel(Faculty.name) private facultyModel: Model<FacultyDocument>) {}

    async createFaculty(facultyData: string): Promise<Faculty>{
        const newFaculty = new this.facultyModel(facultyData);
        return newFaculty.save();
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
            faculty.name = newFacultyName;
            const updatedFaculty = await faculty.save();
        
        
            return updatedFaculty;
        }
        
    }
    async findByName(name: string): Promise<Faculty> {
        const faculty = await this.facultyModel.findOne({ name }).exec();
        if (!faculty) {
            throw new NotFoundException(`Faculty with name ${name} not found`);
        }
        return faculty;
    }
}
