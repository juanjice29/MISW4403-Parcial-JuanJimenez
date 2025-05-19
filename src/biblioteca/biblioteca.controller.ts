// src/biblioteca/biblioteca.controller.ts
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BibliotecaDto } from './biblioteca.dto';
import { BibliotecaEntity } from './biblioteca.entity';
import { BibliotecaService } from './biblioteca.service';

@Controller('libraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecaController {
  constructor(private readonly bibliotecaService: BibliotecaService) {}

  @Get()
  async findAll() {
    return await this.bibliotecaService.findAll();
  }

  @Get(':bibliotecaId')
  async findOne(@Param('bibliotecaId') bibliotecaId: string) {
    return await this.bibliotecaService.findOne(bibliotecaId);
  }

  @Post()
  async create(@Body() bibliotecaDto: BibliotecaDto) {
    const biblioteca = plainToInstance(BibliotecaEntity, bibliotecaDto) as BibliotecaEntity;
    return await this.bibliotecaService.create(biblioteca);
  }

  @Put(':bibliotecaId')
  async update(@Param('bibliotecaId') bibliotecaId: string, @Body() bibliotecaDto: BibliotecaDto) {
    const biblioteca = plainToInstance(BibliotecaEntity, bibliotecaDto) as BibliotecaEntity;
    return await this.bibliotecaService.update(bibliotecaId, biblioteca);
  }

  @Delete(':bibliotecaId')
  @HttpCode(204)
  async delete(@Param('bibliotecaId') bibliotecaId: string) {
    return await this.bibliotecaService.delete(bibliotecaId);
  }
}