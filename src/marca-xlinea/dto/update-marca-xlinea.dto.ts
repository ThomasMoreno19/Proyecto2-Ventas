import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcaXlineaDto } from './create-marca-xlinea.dto';

export class UpdateMarcaXlineaDto extends PartialType(CreateMarcaXlineaDto) {}
