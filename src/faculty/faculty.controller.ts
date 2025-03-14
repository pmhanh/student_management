import { Controller, Put, Post, Body, Get, Param , NotFoundException, Delete, BadRequestException} from '@nestjs/common';
import { FacultyService } from './faculty.service';

@Controller('faculty')
export class FacultyController {
    
    constructor(private readonly facultyService: FacultyService) {}
    @Post()
    async create(@Body() facultyData) {
        const faculty = await this.facultyService.createFaculty(facultyData);
        return faculty;
    }

    @Get()
    async findAll() {
        return this.facultyService.findAll();
    }

    @Get(':name')
    async findOne(@Param('name') name: string) {
        return this.facultyService.findOne(name);
    }

    @Put(':name')
    async update(@Param('name') name: string, @Body() updateFacultyData: {name: string}) {
        console.log("test: ", name, " " , updateFacultyData);
        return this.facultyService.update(name, updateFacultyData.name);

    }

    @Delete(':name')
    async remove(@Param('name') name: string)
    {
        try{
            console.log("name delete faculty: ", name);
            await this.facultyService.deleteFacultyByName(name);
            return {message: 'Khoa đã được xóa thành công.'};
        }catch(error)
        {
            throw new BadRequestException(error.message || 'Không thể xóa khoa.');
            
        }

    }
    
}