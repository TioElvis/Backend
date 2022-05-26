import { IsNotEmpty } from 'class-validator';

export class DeleteFDto {
  @IsNotEmpty()
  idFriendToDelete: string;
}
