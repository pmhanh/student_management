import { Controller, Put, Post, Body, Get, Param , NotFoundException} from '@nestjs/common';
import { FacultyService } from './faculty.service';

@Controller('faculty')
export class FacultyController {
    
    constructor(private readonly facultyService: FacultyService) {}
    @Post()
    async create(@Body() facultyData) {
        const faculty = await this.facultyService.createFaculty(facultyData);
        return faculty;
        // try {
        //     return await this.facultyService.createFaculty(facultyData);
        // } catch (error) {
        //     if (error.response && error.response.message) {
        //         throw new BadRequestException(error.response.message);
        //     }
        //     throw new BadRequestException('Dữ liệu nhập không hợp lệ.');
        // }
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

}