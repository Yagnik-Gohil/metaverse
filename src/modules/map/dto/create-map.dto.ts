import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';

export class CreateMapDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  row: number;

  @IsNotEmpty()
  @IsInt()
  column: number;

  @IsNotEmpty()
  @IsInt()
  tile_size: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  layers: number[][];

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  solid_tile: number[];

  @IsNotEmpty()
  @IsString()
  tile_set: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;
}
