import { IsNotEmpty } from 'class-validator';

export class AcceptFRDto {
  @IsNotEmpty()
  idUserToAccept: string;
}
