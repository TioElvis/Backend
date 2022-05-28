import { PartialType } from '@nestjs/swagger';
import { CreatePDto } from './createP.dto';

export class UpdatePostDto extends PartialType(CreatePDto) {}
