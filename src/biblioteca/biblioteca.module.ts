import { Module } from '@nestjs/common';
import { BibliotecaService } from './biblioteca.service';

@Module({
  providers: [BibliotecaService]
})
export class BibliotecaModule {}
