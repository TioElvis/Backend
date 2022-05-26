import { IsNotEmpty } from 'class-validator';

export class SendFRDto {
  @IsNotEmpty()
  idUserToAdd: string;
}
