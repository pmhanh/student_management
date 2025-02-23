import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Res, Logger} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, Express } from 'multer';
import { UploadService } from './upload.service';
import { Response } from 'express';

@Controller('upload')
export class UploadController {
    private readonly logger = new Logger(UploadService.name);
    constructor(private readonly uploadService: UploadService) {}

    @Post('/students')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const filename = `${Date.now()}-${file.originalname}`;
                    cb(null, filename);
                },
            }),
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        await this.uploadService.uploadStudents(file.path);
        return { message: 'File uploaded and data saved successfully' };
    }

    @Get('/students/json')
    async exportStudentToJson(@Res() res: Response) {
        const filePath = await this.uploadService.exportStudentToJson();
        res.download(filePath);
    }

    @Get('/students/excel')
    async exportStudentToExcel(@Res() res: Response) {
        const filePath = await this.uploadService.exportStudentToExcel();
        res.download(filePath);
    }

    
}
