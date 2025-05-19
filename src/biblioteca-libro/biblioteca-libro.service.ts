// src/biblioteca-libro/biblioteca-libro.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibroEntity } from '../libro/libro.entity';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class BibliotecaLibroService {
  constructor(
    @InjectRepository(BibliotecaEntity)
    private readonly bibliotecaRepository: Repository<BibliotecaEntity>,
    
    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>
  ) {}

  async addBookToLibrary(bibliotecaId: string, libroId: string): Promise<BibliotecaEntity> {
    const libro: LibroEntity| null = await this.libroRepository.findOne({ where: { id: libroId } });
    if (!libro)
      throw new BusinessLogicException("El libro con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
    const biblioteca: BibliotecaEntity| null = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ["libros"]
    });
    if (!biblioteca)
      throw new BusinessLogicException("La biblioteca con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
    biblioteca.libros = [...biblioteca.libros, libro];
    return await this.bibliotecaRepository.save(biblioteca);
  }

  async findBooksFromLibrary(bibliotecaId: string): Promise<LibroEntity[]> {
    const biblioteca: BibliotecaEntity| null = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ["libros"]
    });
    if (!biblioteca)
      throw new BusinessLogicException("La biblioteca con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
    return biblioteca.libros;
  }

  async findBookFromLibrary(bibliotecaId: string, libroId: string): Promise<LibroEntity> {
    const libro: LibroEntity | null= await this.libroRepository.findOne({ where: { id: libroId } });
    if (!libro)
      throw new BusinessLogicException("El libro con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
    const biblioteca: BibliotecaEntity| null = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ["libros"]
    });
    if (!biblioteca)
      throw new BusinessLogicException("La biblioteca con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
    const bibliotecaLibro: LibroEntity | null = biblioteca.libros.find(l => l.id === libro.id) ?? null;
    
    if (!bibliotecaLibro)
      throw new BusinessLogicException("El libro con el ID dado no está asociado a la biblioteca", BusinessError.PRECONDITION_FAILED);
    
    return bibliotecaLibro;
  }

  async updateBooksFromLibrary(bibliotecaId: string, libros: LibroEntity[]): Promise<BibliotecaEntity> {
    const biblioteca: BibliotecaEntity| null = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ["libros"]
    });
    if (!biblioteca)
      throw new BusinessLogicException("La biblioteca con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
    for (const libroItem of libros) {
      const libro: LibroEntity | null = await this.libroRepository.findOne({ where: { id: libroItem.id } });
      if (!libro)
        throw new BusinessLogicException("El libro con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    }
    
    biblioteca.libros = libros;
    return await this.bibliotecaRepository.save(biblioteca);
  }

  async deleteBookFromLibrary(bibliotecaId: string, libroId: string) {
    const libro: LibroEntity| null = await this.libroRepository.findOne({ where: { id: libroId } });
    if (!libro)
      throw new BusinessLogicException("El libro con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
    const biblioteca: BibliotecaEntity| null = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ["libros"]
    });
    if (!biblioteca)
      throw new BusinessLogicException("La biblioteca con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
    const bibliotecaLibro: LibroEntity | null = biblioteca.libros.find(l => l.id === libro.id) ?? null;
    
    if (!bibliotecaLibro)
      throw new BusinessLogicException("El libro con el ID dado no está asociado a la biblioteca", BusinessError.PRECONDITION_FAILED);
    
    biblioteca.libros = biblioteca.libros.filter(l => l.id !== libroId);
    await this.bibliotecaRepository.save(biblioteca);
  }
}

