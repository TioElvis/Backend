import { IsNotEmpty } from 'class-validator';

export class RejectFRDto {
  @IsNotEmpty()
  idUserToRecject: string;
}
