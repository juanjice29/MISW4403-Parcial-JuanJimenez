// src/libro/libro.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { LibroEntity } from './libro.entity';
import { LibroService } from './libro.service';
import { faker } from '@faker-js/faker';

describe('LibroService', () => {
  let service: LibroService;
  let repository: Repository<LibroEntity>;
  let librosList: LibroEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [LibroService],
    }).compile();

    service = module.get<LibroService>(LibroService);
    repository = module.get<Repository<LibroEntity>>(getRepositoryToken(LibroEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    librosList = [];
    for (let i = 0; i < 5; i++) {
      const libro = await repository.save({
        titulo: faker.lorem.words(3) as string,
        autor: faker.person.fullName() as string,
        fechaPublicacion: (faker.date.past() as Date).toISOString().split('T')[0],
        isbn: faker.string.alphanumeric(13) as string
      });
      librosList.push(libro);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all books', async () => {
    const libros: LibroEntity[] = await service.findAll();
    expect(libros).not.toBeNull();
    expect(libros).toHaveLength(librosList.length);
  });

  it('findOne should return a book by id', async () => {
    const storedLibro: LibroEntity = librosList[0];
    const libro: LibroEntity = await service.findOne(storedLibro.id);
    expect(libro).not.toBeNull();
    expect(libro.titulo).toEqual(storedLibro.titulo);
    expect(libro.autor).toEqual(storedLibro.autor);
    expect(libro.isbn).toEqual(storedLibro.isbn);
  });

  it('findOne should throw an exception for an invalid book', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El libro con el ID dado no fue encontrado");
  });

  it('create should return a new book', async () => {
    const libro: LibroEntity = {
      id: "",
      titulo: faker.lorem.words(3) as string,
      autor: faker.person.fullName() as string,
      fechaPublicacion: (faker.date.past() as Date).toISOString().split('T')[0],
      isbn: faker.string.alphanumeric(13) as string,
      bibliotecas: []
    };

    const newLibro: LibroEntity = await service.create(libro);
    expect(newLibro).not.toBeNull();

    const storedLibro: LibroEntity| null = await repository.findOne({ where: { id: newLibro.id } });
    expect(storedLibro).not.toBeNull();
    expect(storedLibro!.titulo).toEqual(newLibro.titulo);
    expect(storedLibro!.autor).toEqual(newLibro.autor);
    expect(storedLibro!.isbn).toEqual(newLibro.isbn);
  });

  it('create should throw an exception for invalid publication date', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const libro: LibroEntity = {
      id: "",
      titulo: faker.lorem.words(3) as string,
      autor: faker.person.fullName() as string,
      fechaPublicacion: tomorrow.toISOString().split('T')[0], // Fecha futura
      isbn: faker.string.alphanumeric(13)  as string,
      bibliotecas: []
    };

    await expect(() => service.create(libro)).rejects.toHaveProperty("message", "La fecha de publicación no puede ser mayor a la fecha actual");
  });

  it('update should modify a book', async () => {
    const libro: LibroEntity = librosList[0];
    libro.titulo = "New title";
    libro.autor = "New author";
    
    const updatedLibro: LibroEntity = await service.update(libro.id, libro);
    expect(updatedLibro).not.toBeNull();
    
    const storedLibro: LibroEntity| null  = await repository.findOne({ where: { id: libro.id } });
    expect(storedLibro).not.toBeNull();
    expect(storedLibro!.titulo).toEqual(libro.titulo);
    expect(storedLibro!.autor).toEqual(libro.autor);
  });

  it('update should throw an exception for an invalid book', async () => {
    let libro: LibroEntity = librosList[0];
    libro = {
      ...libro, titulo: "New title", autor: "New author"
    }
    await expect(() => service.update("0", libro)).rejects.toHaveProperty("message", "El libro con el ID dado no fue encontrado");
  });

  it('update should throw an exception for invalid publication date', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const libro: LibroEntity = librosList[0];
    libro.fechaPublicacion = tomorrow.toISOString().split('T')[0]; // Fecha futura
    
    await expect(() => service.update(libro.id, libro)).rejects.toHaveProperty("message", "La fecha de publicación no puede ser mayor a la fecha actual");
  });

  it('delete should remove a book', async () => {
    const libro: LibroEntity = librosList[0];
    await service.delete(libro.id);
    
    const deletedLibro: LibroEntity | null = await repository.findOne({ where: { id: libro.id } });
    expect(deletedLibro).toBeNull();
  });

  it('delete should throw an exception for an invalid book', async () => {   
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El libro con el ID dado no fue encontrado");
  });
});