import { Module } from '@nestjs/common';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaController } from './biblioteca.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BibliotecaEntity])],
  providers: [BibliotecaService],
  controllers: [BibliotecaController]
})
export class BibliotecaModule {}
