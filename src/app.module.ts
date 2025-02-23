import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { StudentController } from './student/student.controller';
import { StudentService } from './student/student.service';
import { FacultyModule } from './faculty/faculty.module';
import { StatusModule } from './status/status.module';
import { ProgramModule } from './program/program.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://student_management:student_management@test.kty4o.mongodb.net/'),
    StudentModule,
    FacultyModule,
    StatusModule,
    ProgramModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}