import { Controller, Put, Post, Body, Get, Param , NotFoundException} from '@nestjs/common';
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

    @Put(':name')
    async update(@Param('name') name: string, @Body() updateFacultyData: {name: string}) {
        console.log("test: ", name, " " , updateFacultyData);
        return this.statusService.update(name, updateFacultyData.name);

    }
}
