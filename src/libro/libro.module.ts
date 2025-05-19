import { Module } from '@nestjs/common';
import { LibroService } from './libro.service';
import { LibroController } from './libro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from './libro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LibroEntity])],
  providers: [LibroService],
  controllers: [LibroController]
})
export class LibroModule {}
