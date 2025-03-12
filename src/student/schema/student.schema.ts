import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

    @Prop({ type: Types.ObjectId, ref: 'Faculty', required: true })
    faculty: Types.ObjectId;

    @Prop({ required: true })
    course: string;

    @Prop({ type: Types.ObjectId, ref: 'Program', required: true })
    program: Types.ObjectId;

    @Prop()
    address: string;

    @Prop({ required: true, unique: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })
    email: string;

    @Prop({ required: true, match: /^[0-9]{10,11}$/ })
    phone: string;

    @Prop({ type: Types.ObjectId, ref: 'Status', required: true })
    status: Types.ObjectId;

    @Prop({type: Date, default: Date.now})
    createdAt: Date 
}

export const StudentSchema = SchemaFactory.createForClass(Student);