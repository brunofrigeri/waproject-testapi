import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength, IsNumber, IsOptional } from 'class-validator';
import { IOrder } from 'modules/database/interfaces/order';

export class SaveValidator implements IOrder {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, type: 'integer' })
  public id?: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ required: true, type: 'string', minLength: 3, maxLength: 50 })
  public description: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: 'integer' })
  public quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true, type: 'float' })
  public value: number;
}
