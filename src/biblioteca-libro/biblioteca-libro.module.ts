import { Module } from '@nestjs/common';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { BibliotecaLibroController } from './biblioteca-libro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from 'src/libro/libro.entity';
import { BibliotecaEntity } from 'src/biblioteca/biblioteca.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BibliotecaEntity,LibroEntity])],
  providers: [BibliotecaLibroService],
  controllers: [BibliotecaLibroController]
})
export class BibliotecaLibroModule {}
