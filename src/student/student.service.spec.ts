import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getModelToken } from '@nestjs/mongoose';
import { Student } from './schema/student.schema';
import { Model } from 'mongoose';
import { StatusService } from 'src/status/status.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

jest.mock('src/logger', () => ({
  logInfo: jest.fn(),
}));

const mockStudent = {
  studentId: '12345',
  fullName: 'John Doe',
  birthDate: new Date('2000-01-01'),
  gender: 'Nam',
  faculty: 'Khoa luật',
  course: '2025',
  program: 'CLC',
  email: 'johndoe@gmail.com',
  phone: '0965345267',
  status: 'Đang học',
};

const mockStudentModel = {
  create: jest.fn().mockResolvedValue(mockStudent),
  find: jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockStudent]),
    }),
  }),
  findOne: jest.fn(),
};

const mockStatusService = {
  getStatus: jest.fn().mockReturnValue('Đang học'),
};

const mockConfigService = {
  get: jest.fn().mockImplementation((key: string) => {
    console.log(`ConfigService.get called key: ${key}`);
    if (key === 'defaultCountry') return 'VN';
    if (key === 'ALLOWED_EMAIL_DOMAIN') return 'gmail.com';
    return null;
  }),
};

describe('StudentService', () => {
  let service: StudentService;
  let model: Model<Student>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getModelToken(Student.name),
          useValue: mockStudentModel,
        },
        {
          provide: StatusService,
          useValue: mockStatusService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    model = module.get<Model<Student>>(getModelToken(Student.name));
  });

  afterEach(() => {
    jest.clearAllMocks()
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a student', async () => {
    mockStudentModel.findOne.mockResolvedValue(null);
    const student = await service.createStudent(mockStudent);
    expect(student).toEqual(mockStudent);
    expect(model.create).toHaveBeenCalledWith(mockStudent);
  });

  it('should return all students', async () => {
    const students = await service.getStudents();
    expect(students).toEqual([mockStudent]);
    expect(model.find).toHaveBeenCalled();
  });

  it('should return a student by ID', async () => {
    mockStudentModel.findOne.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockStudent),
      }),
    });
    const student = await service.getStudentById('12345');
    expect(student).toEqual(mockStudent);
    expect(model.findOne).toHaveBeenCalledWith({ studentId: '12345' });
  });
});