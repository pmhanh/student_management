import { Controller, Put, Post, Body, Get, Param , NotFoundException, Delete, BadRequestException} from '@nestjs/common';
import { StatusService } from './status.service';

@Controller('status')
export class StatusController {
    constructor(private readonly statusService: StatusService) {}
    @Post()
    async create(@Body() facultyData) {
        const faculty = await this.statusService.createStatus(facultyData);
        return faculty;
    }

    @Get()
    async findAll() {
        return this.statusService.findAll();
    }

    @Get(':name')
    async findOne(@Param('name') name: string) {
        return this.statusService.findOne(name);
    }

    @Get(':id/name')
    async getStatusName(@Param('id') statusId: string): Promise<string> {
        try {
            return await this.statusService.getStatusNameById(statusId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new NotFoundException('Error retrieving status name');
        }
    }
        
    @Put(':name')
    async update(@Param('name') name: string, @Body() updateFacultyData: {name: string}) {
        console.log("test: ", name, " " , updateFacultyData);
        return this.statusService.update(name, updateFacultyData.name);

    }

    @Delete(':name')
    async remove(@Param('name') name: string)
    {
        try{
            console.log("name delete faculty: ", name);
            await this.statusService.deleteStatusByName(name);
            return {message: 'Khoa đã được xóa thành công.'};
        }catch(error)
        {
            throw new BadRequestException(error.message || 'Không thể xóa khoa.');
            
        }

    }
}
