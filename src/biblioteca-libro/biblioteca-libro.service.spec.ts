// src/biblioteca-libro/biblioteca-libro.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { faker } from '@faker-js/faker';

describe('BibliotecaLibroService', () => {
  let service: BibliotecaLibroService;
  let bibliotecaRepository: Repository<BibliotecaEntity>;
  let libroRepository: Repository<LibroEntity>;
  let biblioteca: BibliotecaEntity;
  let librosList: LibroEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BibliotecaLibroService],
    }).compile();

    service = module.get<BibliotecaLibroService>(BibliotecaLibroService);
    bibliotecaRepository = module.get<Repository<BibliotecaEntity>>(getRepositoryToken(BibliotecaEntity));
    libroRepository = module.get<Repository<LibroEntity>>(getRepositoryToken(LibroEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    libroRepository.clear();
    bibliotecaRepository.clear();

    librosList = [];
    for (let i = 0; i < 5; i++) {
      const libro: LibroEntity = await libroRepository.save({
        titulo: faker.lorem.words(3) as string,
        autor: faker.person.fullName() as string,
        fechaPublicacion: (faker.date.past() as Date).toISOString().split('T')[0],
        isbn: faker.string.alphanumeric(13) as string,
      });
      librosList.push(libro);
    }

    biblioteca = await bibliotecaRepository.save({
      nombre: faker.company.name() as string,
      direccion: faker.location.streetAddress() as string,
      ciudad: faker.location.city() as string,
      horarioAtencion: '08:00-18:00',
      libros: librosList
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addBookToLibrary should add a book to a library', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(3) as string,
        autor: faker.person.fullName() as string,
        fechaPublicacion: (faker.date.past() as Date).toISOString().split('T')[0],
        isbn: faker.string.alphanumeric(13) as string,
    });

    const newBiblioteca: BibliotecaEntity = await bibliotecaRepository.save({
      nombre: faker.company.name() as string,
      direccion: faker.location.streetAddress() as string,
      ciudad: faker.location.city() as string,
      horarioAtencion: '08:00-18:00',
    });

    const result: BibliotecaEntity = await service.addBookToLibrary(newBiblioteca.id, newLibro.id);
    expect(result.libros.length).toBe(1);
    expect(result.libros[0]).not.toBeNull();
    expect(result.libros[0].titulo).toBe(newLibro.titulo);
    expect(result.libros[0].autor).toBe(newLibro.autor);
    expect(result.libros[0].isbn).toBe(newLibro.isbn);
  });

  it('addBookToLibrary should throw exception for an invalid book', async () => {
    const newBiblioteca: BibliotecaEntity = await bibliotecaRepository.save({
      nombre: faker.company.name() as string,
      direccion: faker.location.streetAddress() as string,
      ciudad: faker.location.city() as string,
      horarioAtencion: '08:00-18:00',
    });

    await expect(() => service.addBookToLibrary(newBiblioteca.id, "0")).rejects.toHaveProperty("message", "El libro con el ID dado no fue encontrado");
  });

  it('addBookToLibrary should throw exception for an invalid library', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(3) as string,
        autor: faker.person.fullName() as string,
        fechaPublicacion: (faker.date.past() as Date).toISOString().split('T')[0],
        isbn: faker.string.alphanumeric(13) as string,
    });

    await expect(() => service.addBookToLibrary("0", newLibro.id)).rejects.toHaveProperty("message", "La biblioteca con el ID dado no fue encontrada");
  });

  it('findBooksFromLibrary should return books by library', async () => {
    const libros: LibroEntity[] = await service.findBooksFromLibrary(biblioteca.id);
    expect(libros.length).toBe(5);
  });

  it('findBooksFromLibrary should throw exception for an invalid library', async () => {
    await expect(() => service.findBooksFromLibrary("0")).rejects.toHaveProperty("message", "La biblioteca con el ID dado no fue encontrada");
  });

  it('findBookFromLibrary should return a book by library', async () => {
    const libro: LibroEntity = librosList[0];
    const storedLibro: LibroEntity = await service.findBookFromLibrary(biblioteca.id, libro.id);
    expect(storedLibro).not.toBeNull();
    expect(storedLibro.titulo).toBe(libro.titulo);
    expect(storedLibro.autor).toBe(libro.autor);
    expect(storedLibro.isbn).toBe(libro.isbn);
  });

  it('findBookFromLibrary should throw exception for an invalid book', async () => {
    await expect(() => service.findBookFromLibrary(biblioteca.id, "0")).rejects.toHaveProperty("message", "El libro con el ID dado no fue encontrado");
  });

  it('findBookFromLibrary should throw exception for an invalid library', async () => {
    const libro: LibroEntity = librosList[0];
    await expect(() => service.findBookFromLibrary("0", libro.id)).rejects.toHaveProperty("message", "La biblioteca con el ID dado no fue encontrada");
  });

  it('findBookFromLibrary should throw exception for a book not associated to the library', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(3) as string,
        autor: faker.person.fullName() as string,
        fechaPublicacion: (faker.date.past() as Date).toISOString().split('T')[0],
        isbn: faker.string.alphanumeric(13) as string,
    });

    await expect(() => service.findBookFromLibrary(biblioteca.id, newLibro.id)).rejects.toHaveProperty("message", "El libro con el ID dado no está asociado a la biblioteca");
  });

  it('updateBooksFromLibrary should update books list for a library', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(3) as string,
        autor: faker.person.fullName() as string,
        fechaPublicacion: (faker.date.past() as Date).toISOString().split('T')[0],
        isbn: faker.string.alphanumeric(13) as string,
    });

    const updatedBiblioteca: BibliotecaEntity = await service.updateBooksFromLibrary(biblioteca.id, [newLibro]);
    expect(updatedBiblioteca.libros.length).toBe(1);
    expect(updatedBiblioteca.libros[0].titulo).toBe(newLibro.titulo);
    expect(updatedBiblioteca.libros[0].autor).toBe(newLibro.autor);
    expect(updatedBiblioteca.libros[0].isbn).toBe(newLibro.isbn);
  });

  it('updateBooksFromLibrary should throw exception for an invalid library', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(3) as string,
        autor: faker.person.fullName() as string,
        fechaPublicacion: (faker.date.past() as Date).toISOString().split('T')[0],
        isbn: faker.string.alphanumeric(13) as string,
    });

    await expect(() => service.updateBooksFromLibrary("0", [newLibro])).rejects.toHaveProperty("message", "La biblioteca con el ID dado no fue encontrada");
  });

  it('updateBooksFromLibrary should throw exception for an invalid book', async () => {
    const newLibro: LibroEntity = librosList[0];
    newLibro.id = "0";

    await expect(() => service.updateBooksFromLibrary(biblioteca.id, [newLibro])).rejects.toHaveProperty("message", "El libro con el ID dado no fue encontrado");
  });

  it('deleteBookFromLibrary should remove a book from a library', async () => {
    const libro: LibroEntity = librosList[0];
    
    await service.deleteBookFromLibrary(biblioteca.id, libro.id);

    const storedBiblioteca: BibliotecaEntity| null = await bibliotecaRepository.findOne({ where: { id: biblioteca.id }, relations: ["libros"] });
    const deletedLibro: LibroEntity | undefined = storedBiblioteca?.libros?.find(l => l.id === libro.id);
    expect(deletedLibro).toBeUndefined();
  });

  it('deleteBookFromLibrary should throw exception for an invalid book', async () => {
    await expect(() => service.deleteBookFromLibrary(biblioteca.id, "0")).rejects.toHaveProperty("message", "El libro con el ID dado no fue encontrado");
  });

  it('deleteBookFromLibrary should throw exception for an invalid library', async () => {
    const libro: LibroEntity = librosList[0];
    await expect(() => service.deleteBookFromLibrary("0", libro.id)).rejects.toHaveProperty("message", "La biblioteca con el ID dado no fue encontrada");
  });

  it('deleteBookFromLibrary should throw exception for a book not associated to the library', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(3) as string,
        autor: faker.person.fullName() as string,
        fechaPublicacion: (faker.date.past() as Date).toISOString().split('T')[0],
        isbn: faker.string.alphanumeric(13) as string,
    });

    await expect(() => service.deleteBookFromLibrary(biblioteca.id, newLibro.id)).rejects.toHaveProperty("message", "El libro con el ID dado no está asociado a la biblioteca");
  });
});