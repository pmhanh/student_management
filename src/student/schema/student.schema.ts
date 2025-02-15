import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
    @Prop({ required: true, unique: true })
    studentId: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    birthDate: Date;

    @Prop({ required: true, enum: ['Nam', 'Nữ'] })
    gender: string;

    @Prop({ required: true, enum: ['Khoa Luật', 'Khoa Tiếng Anh thương mại', 'Khoa Tiếng Nhật', 'Khoa Tiếng Pháp'] })
    department: string;

    @Prop({ required: true })
    course: string;

    @Prop({ required: true })
    program: string;

    @Prop()
    address: string;

    @Prop({ required: true, unique: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })
    email: string;

    @Prop({ required: true, match: /^[0-9]{10,11}$/ })
    phone: string;

    @Prop({ required: true, enum: ['Đang học', 'Đã tốt nghiệp', 'Đã thôi học', 'Tạm dừng học'] })
    status: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);