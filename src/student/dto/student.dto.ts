import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, Matches, Validate } from 'class-validator';
import { Types } from 'mongoose';

export class CreateStudentDto {
    @IsNotEmpty({ message: 'MSSV không được để trống' })
    studentId: string;

    @IsNotEmpty({ message: 'Họ tên không được để trống' })
    fullName: string;

    @IsNotEmpty({ message: 'Ngày sinh không được để trống' })
    birthDate: Date;

    @IsEnum(['Nam', 'Nữ'], { message: 'Giới tính phải là Nam hoặc Nữ' })
    gender: string;

    @IsNotEmpty({ message: 'Khoa không được để trống' })
    faculty: Types.ObjectId;

    @IsNotEmpty({ message: 'Khóa không được để trống' })
    course: string;

    @IsNotEmpty({ message: 'Chương trình không được để trống' })
    program: Types.ObjectId;

    @IsOptional()
    address?: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    // @Validate(EmailDomainValidate, {message: 'Email không thuộc tên miền cho phép'})
    email: string;

    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @Matches(/^[0-9]{10,11}$/, { message: 'Số điện thoại phải có 10-11 chữ số' })
    phone: string;

    @IsNotEmpty({ message: 'Trạng thái không được để trống' })
    status: Types.ObjectId;
}