import { Controller, Put, Post, Body, Get, Param , NotFoundException, Delete, BadRequestException} from '@nestjs/common';
import { ProgramService } from './program.service';

@Controller('program')
export class ProgramController {
    constructor(private readonly programService: ProgramService) {}
    @Post()
    async create(@Body() programData) {
        const faculty = await this.programService.createProgram(programData);
        return faculty;
    }

    @Get()
    async findAll() {
        return this.programService.findAll();
    }

    @Get(':name')
    async findOne(@Param('name') name: string) {
        return this.programService.findOne(name);
    }

    @Put(':name')
    async update(@Param('name') name: string, @Body() updateProgramData: {name: string}) {
        console.log("test: ", name, " " , updateProgramData);
        return this.programService.update(name, updateProgramData.name);

    }

    @Delete(':name')
    async remove(@Param('name') name: string)
    {
        try{
            console.log("name delete program: ", name);
            await this.programService.deleteProgramByName(name);
            return {message: 'Khoa đã được xóa thành công.'};
        }catch(error)
        {
            throw new BadRequestException(error.message || 'Không thể xóa khoa.');
            
        }

    }
}
