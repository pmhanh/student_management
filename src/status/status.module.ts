import { forwardRef, Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Status, StatusSchema } from 'src/status/status.schema';
import { StudentModule } from 'src/student/student.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Status.name, schema: StatusSchema }]),
        forwardRef(() => StudentModule),
    ],
    controllers: [StatusController],
    providers: [StatusService], 
    exports: [StatusService]
})
export class StatusModule {}
