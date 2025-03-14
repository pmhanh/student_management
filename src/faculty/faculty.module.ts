import { forwardRef, Module } from '@nestjs/common';
import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Faculty, FacultySchema } from './faculty.schema';
import { StudentModule } from 'src/student/student.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Faculty.name, schema: FacultySchema }]),
        forwardRef(() => StudentModule),
    ],
    controllers: [FacultyController],
    providers: [FacultyService],
    exports: [FacultyService],
})
export class FacultyModule {}
