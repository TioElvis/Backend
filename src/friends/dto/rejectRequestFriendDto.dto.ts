import { IsNotEmpty } from 'class-validator';

export class RejectRequestFriendDto {
  @IsNotEmpty()
  idUserToRecject: string;
}
