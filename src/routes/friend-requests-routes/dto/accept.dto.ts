import { IsNotEmpty } from 'class-validator';

export class AcceptDto {
  @IsNotEmpty()
  requestToAccept: string;
}
