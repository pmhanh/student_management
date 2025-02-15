import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { StudentController } from './student/student.controller';
import { StudentService } from './student/student.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://student_management:student_management@test.kty4o.mongodb.net/'),
    StudentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}