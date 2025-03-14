import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schema/student.schema';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { StatusModule } from 'src/status/status.module';
import { FacultyModule } from 'src/faculty/faculty.module';
import { FacultyService } from 'src/faculty/faculty.service';
import { ProgramModule } from 'src/program/program.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
            StatusModule,
            ProgramModule,
            forwardRef(() => FacultyModule),
        ],
    controllers: [StudentController],
    providers: [StudentService],
    exports: [StudentService],
})
export class StudentModule {}