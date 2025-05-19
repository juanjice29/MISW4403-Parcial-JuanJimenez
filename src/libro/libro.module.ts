import { Module } from '@nestjs/common';
import { LibroService } from './libro.service';

@Module({
  providers: [LibroService]
})
export class LibroModule {}
