import { IsNotEmpty } from 'class-validator';

export class CancelDto {
  @IsNotEmpty()
  requestToCancel: string;
}
