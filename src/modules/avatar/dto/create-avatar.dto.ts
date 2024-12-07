import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAvatarDto {
  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsInt()
  tile_size: number;
}
