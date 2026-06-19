import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
} from 'class-validator';
import { Column } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  firstName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  lastName: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  @ApiProperty({ description: 'Password of the user', example: 'Password123!' })
  password: string;
}
