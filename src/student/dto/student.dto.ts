import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateStudentDto {
    @IsNotEmpty({ message: 'MSSV không được để trống' })
    studentId: string;

    @IsNotEmpty({ message: 'Họ tên không được để trống' })
    fullName: string;

    @IsNotEmpty({ message: 'Ngày sinh không được để trống' })
    birthDate: Date;

    @IsEnum(['Nam', 'Nữ'], { message: 'Giới tính phải là Nam hoặc Nữ' })
    gender: string;

    @IsEnum(['Khoa Luật', 'Khoa Tiếng Anh thương mại', 'Khoa Tiếng Nhật', 'Khoa Tiếng Pháp'], { message: 'Khoa không hợp lệ' })
    department: string;

    @IsNotEmpty({ message: 'Khóa không được để trống' })
    course: string;

    @IsNotEmpty({ message: 'Chương trình không được để trống' })
    program: string;

    @IsOptional()
    address?: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @Matches(/^[0-9]{10,11}$/, { message: 'Số điện thoại phải có 10-11 chữ số' })
    phone: string;

    @IsEnum(['Đang học', 'Đã tốt nghiệp', 'Đã thôi học', 'Tạm dừng học'], { message: 'Trạng thái không hợp lệ' })
    status: string;
}
