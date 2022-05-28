import { IsNotEmpty } from 'class-validator';

export class CancelFRDto {
  @IsNotEmpty()
  idUserToCancel: string;
}
