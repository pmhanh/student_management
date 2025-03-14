import { forwardRef, Module } from '@nestjs/common';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Program, ProgramSchema } from './program.schema';
import { StudentModule } from 'src/student/student.module';

@Module({
    imports : [
        MongooseModule.forFeature([{ name: Program.name, schema: ProgramSchema}]),
        forwardRef(() => StudentModule),
    
    ],
    controllers: [ProgramController],
    providers: [ProgramService],
    exports: [ProgramService]
})
export class ProgramModule {}
