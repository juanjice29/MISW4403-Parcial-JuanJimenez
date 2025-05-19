import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { LibroEntity } from './libro.entity';

@Injectable()
export class LibroService {
  constructor(
    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>
  ) {}

  async findAll(): Promise<LibroEntity[]> {
    return await this.libroRepository.find({ relations: ["bibliotecas"] });
  }

  async findOne(id: string): Promise<LibroEntity> {
    const libro: LibroEntity| null = await this.libroRepository.findOne({
      where: { id },
      relations: ["bibliotecas"]
    });
    if (!libro)
      throw new BusinessLogicException("El libro con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
    return libro;
  }

  async create(libro: LibroEntity): Promise<LibroEntity> {
    this.validateFechaPublicacion(libro.fechaPublicacion);
    return await this.libroRepository.save(libro);
  }

  async update(id: string, libro: LibroEntity): Promise<LibroEntity> {
    const persistedLibro: LibroEntity | null= await this.libroRepository.findOne({ where: { id } });
    if (!persistedLibro)
      throw new BusinessLogicException("El libro con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
    this.validateFechaPublicacion(libro.fechaPublicacion);
    
    libro.id = id;
    return await this.libroRepository.save(libro);
  }

  async delete(id: string) {
    const libro: LibroEntity | null= await this.libroRepository.findOne({ where: { id } });
    if (!libro)
      throw new BusinessLogicException("El libro con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
    await this.libroRepository.remove(libro);
  }

  private validateFechaPublicacion(fecha: string): void {
    if (!fecha) return;
    
    const fechaPublicacion = new Date(fecha);
    const hoy = new Date();
    
    if (fechaPublicacion > hoy) {
      throw new BusinessLogicException(
        "La fecha de publicación no puede ser mayor a la fecha actual", 
        BusinessError.PRECONDITION_FAILED
      );
    }
  }
}