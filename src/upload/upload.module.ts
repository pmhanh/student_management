import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { StudentModule } from 'src/student/student.module';
import { UploadService } from './upload.service';
import { FacultyModule } from 'src/faculty/faculty.module';
import { ProgramModule } from 'src/program/program.module';
import { StatusModule } from 'src/status/status.module';

@Module({
    imports: [
        MulterModule.register({
            dest: './uploads',
        }),
        StudentModule,
        FacultyModule,
        ProgramModule,
        StatusModule
    ],
  controllers: [UploadController],
  providers: [ UploadService],
})
export class UploadModule {}