import { IsNotEmpty } from 'class-validator';

export class DeleteFriendDto {
  @IsNotEmpty()
  idFriendToDelete: string;
}
