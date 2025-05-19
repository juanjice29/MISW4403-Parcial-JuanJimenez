// src/biblioteca-libro/biblioteca-libro.controller.ts
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { LibroDto } from '../libro/libro.dto';
import { LibroEntity } from '../libro/libro.entity';
import { BibliotecaLibroService } from './biblioteca-libro.service';

@Controller('libraries/:bibliotecaId/books')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecaLibroController {
  constructor(private readonly bibliotecaLibroService: BibliotecaLibroService) {}

  @Post(':libroId')
  async addBookToLibrary(
    @Param('bibliotecaId') bibliotecaId: string,
    @Param('libroId') libroId: string
  ) {
    return await this.bibliotecaLibroService.addBookToLibrary(bibliotecaId, libroId);
  }

  @Get()
  async findBooksFromLibrary(@Param('bibliotecaId') bibliotecaId: string) {
    return await this.bibliotecaLibroService.findBooksFromLibrary(bibliotecaId);
  }

  @Get(':libroId')
  async findBookFromLibrary(
    @Param('bibliotecaId') bibliotecaId: string,
    @Param('libroId') libroId: string
  ) {
    return await this.bibliotecaLibroService.findBookFromLibrary(bibliotecaId, libroId);
  }

  @Put()
  async updateBooksFromLibrary(
    @Param('bibliotecaId') bibliotecaId: string,
    @Body() librosDto: LibroDto[]
  ) {
    const libros: LibroEntity[] = plainToInstance(LibroEntity, librosDto) as LibroEntity[];
    return await this.bibliotecaLibroService.updateBooksFromLibrary(bibliotecaId, libros);
  }

  @Delete(':libroId')
  @HttpCode(204)
  async deleteBookFromLibrary(
    @Param('bibliotecaId') bibliotecaId: string,
    @Param('libroId') libroId: string
  ) {
    return await this.bibliotecaLibroService.deleteBookFromLibrary(bibliotecaId, libroId);
  }
}