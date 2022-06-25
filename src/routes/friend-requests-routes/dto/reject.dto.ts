import { IsNotEmpty } from 'class-validator';

export class RejectDto {
  @IsNotEmpty()
  requestToReject: string;
}
