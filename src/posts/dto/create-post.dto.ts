import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  userId: string;

  image?: {
    url: string;
    public_id: string;
  };

  description?: string;
}
