import { IsNotEmpty } from 'class-validator';

export class SendDto {
  @IsNotEmpty()
  sendRequest: string;
}
