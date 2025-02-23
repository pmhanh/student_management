import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Status, StatusSchema } from 'src/status/status.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Status.name, schema: StatusSchema }]),
    ],
    controllers: [StatusController],
    providers: [StatusService], 
    exports: [StatusService]
})
export class StatusModule {}
