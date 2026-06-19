import { IsInt, IsNotEmpty } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class EditUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'The ID of the user to edit', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
