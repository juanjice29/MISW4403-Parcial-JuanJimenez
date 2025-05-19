import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { BibliotecaEntity } from './biblioteca.entity';

@Injectable()
export class BibliotecaService {
  constructor(
    @InjectRepository(BibliotecaEntity)
    private readonly bibliotecaRepository: Repository<BibliotecaEntity>
  ) {}

  async findAll(): Promise<BibliotecaEntity[]> {
    return await this.bibliotecaRepository.find({ relations: ["libros"] });
  }

  async findOne(id: string): Promise<BibliotecaEntity> {
    const biblioteca: BibliotecaEntity | null= await this.bibliotecaRepository.findOne({
      where: { id },
      relations: ["libros"]
    });
    if (!biblioteca)
      throw new BusinessLogicException("La biblioteca con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
    return biblioteca;
  }

  async create(biblioteca: BibliotecaEntity): Promise<BibliotecaEntity> {
    
    return await this.bibliotecaRepository.save(biblioteca);
  }

  async update(id: string, biblioteca: BibliotecaEntity): Promise<BibliotecaEntity> {
    const persistedBiblioteca: BibliotecaEntity | null= await this.bibliotecaRepository.findOne({ where: { id } });
    if (!persistedBiblioteca)
      throw new BusinessLogicException("La biblioteca con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
    biblioteca.id = id;
    return await this.bibliotecaRepository.save(biblioteca);
  }

  async delete(id: string) {
    const biblioteca: BibliotecaEntity| null = await this.bibliotecaRepository.findOne({ where: { id } });
    if (!biblioteca)
      throw new BusinessLogicException("La biblioteca con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
    await this.bibliotecaRepository.remove(biblioteca);
  }

  
}