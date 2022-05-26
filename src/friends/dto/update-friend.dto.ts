import { PartialType } from '@nestjs/swagger';
import { SendFRDto } from './sendFR.dto';

export class UpdateFriendDto extends PartialType(SendFRDto) {}
