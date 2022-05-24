import { PartialType } from '@nestjs/swagger';
import { SendRequestFriendDto } from './sendRequestFriendDto.dto';

export class UpdateFriendDto extends PartialType(SendRequestFriendDto) {}
