import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Status, StatusDocument } from './status.schema';
import {Model} from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { logInfo } from 'src/logger';
@Injectable()
export class StatusService {
    constructor(@InjectModel(Status.name) private statusModel: Model<StatusDocument>) {}

    async createStatus(statusData: string): Promise<Status>{
        const newStatus = new this.statusModel(statusData);
        const {name} = newStatus;
        logInfo('Thêm trạng thái học sinh', `Tên: ${name}` );

        return newStatus.save();
    }

    async findAll(): Promise<Status[]> {
        return this.statusModel.find().exec();
    }

    async findOne(name: string): Promise<Status | null> {
        return this.statusModel.findOne({name}).exec();
    }

    async update(name: string, newStatusName: string): Promise<Status | null> {
        const status = await this.statusModel.findOne({ name }).exec();
        
        if (!status) {
            console.log("sai");
            throw new NotFoundException("Trạng thái sinh viên không tồn tại");
        }
        else
        {
                logInfo('Cập nhật trạng thái học sinh', `Cũ: ${name} - Mới: ${newStatusName}` );
            
            status.name = newStatusName;
            return await status.save();
        }
    }

    async findByName(name: string): Promise<Status> {
        const status = await this.statusModel.findOne({ name }).exec();
        if (!status) {
            throw new NotFoundException(`Status with name ${name} not found`);
        }
        return status;
    }

    async getStatusNameById(statusId: string): Promise<string> {
        const status = await this.statusModel.findById(statusId).exec();
        if (!status) {
            throw new NotFoundException('Status not found');
        }
        return status.name;
    }
}
