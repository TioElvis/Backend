import { IsNotEmpty } from 'class-validator';

export class AcceptRequestFriendDto {
  @IsNotEmpty()
  idUserToAccept: string;
}
