// src/biblioteca/biblioteca.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BibliotecaEntity } from './biblioteca.entity';
import { BibliotecaService } from './biblioteca.service';
import { faker } from '@faker-js/faker';

describe('BibliotecaService', () => {
  let service: BibliotecaService;
  let repository: Repository<BibliotecaEntity>;
  let bibliotecasList: BibliotecaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BibliotecaService],
    }).compile();

    service = module.get<BibliotecaService>(BibliotecaService);
    repository = module.get<Repository<BibliotecaEntity>>(getRepositoryToken(BibliotecaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    bibliotecasList = [];
    for (let i = 0; i < 5; i++) {
      const biblioteca = await repository.save({
        nombre: faker.company.name() as string,
        direccion: faker.location.streetAddress() as string,
        ciudad: faker.location.city() as string,
        horarioAtencion: '08:00-18:00'
      });
      bibliotecasList.push(biblioteca);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all libraries', async () => {
    const bibliotecas: BibliotecaEntity[] = await service.findAll();
    expect(bibliotecas).not.toBeNull();
    expect(bibliotecas).toHaveLength(bibliotecasList.length);
  });

  it('findOne should return a library by id', async () => {
    const storedBiblioteca: BibliotecaEntity = bibliotecasList[0];
    const biblioteca: BibliotecaEntity = await service.findOne(storedBiblioteca.id);
    expect(biblioteca).not.toBeNull();
    expect(biblioteca.nombre).toEqual(storedBiblioteca.nombre);
    expect(biblioteca.direccion).toEqual(storedBiblioteca.direccion);
    expect(biblioteca.ciudad).toEqual(storedBiblioteca.ciudad);
  });

  it('findOne should throw an exception for an invalid library', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La biblioteca con el ID dado no fue encontrada");
  });

  it('create should return a new library', async () => {
    const biblioteca: BibliotecaEntity = {
      id: "",
      nombre: faker.company.name() as string,
      direccion: faker.location.streetAddress() as string,
      ciudad: faker.location.city() as string,
      horarioAtencion: '09:00-17:00',
      libros: []
    };

    const newBiblioteca: BibliotecaEntity = await service.create(biblioteca);
    expect(newBiblioteca).not.toBeNull();

    const storedBiblioteca: BibliotecaEntity| null = await repository.findOne({ where: { id: newBiblioteca.id } });
    expect(storedBiblioteca).not.toBeNull();
    expect(storedBiblioteca!.nombre).toEqual(newBiblioteca.nombre);
    expect(storedBiblioteca!.direccion).toEqual(newBiblioteca.direccion);
    expect(storedBiblioteca!.ciudad).toEqual(newBiblioteca.ciudad);
  });

  it('update should modify a library', async () => {
    const biblioteca: BibliotecaEntity = bibliotecasList[0];
    biblioteca.nombre = "New name";
    biblioteca.direccion = "New address";
    
    const updatedBiblioteca: BibliotecaEntity = await service.update(biblioteca.id, biblioteca);
    expect(updatedBiblioteca).not.toBeNull();
    
    const storedBiblioteca: BibliotecaEntity| null = await repository.findOne({ where: { id: biblioteca.id } });
    expect(storedBiblioteca).not.toBeNull();
    expect(storedBiblioteca!.nombre).toEqual(biblioteca.nombre);
    expect(storedBiblioteca!.direccion).toEqual(biblioteca.direccion);
  });

  it('update should throw an exception for an invalid library', async () => {
    let biblioteca: BibliotecaEntity = bibliotecasList[0];
    biblioteca = {
      ...biblioteca, nombre: "New name", direccion: "New address"
    }
    await expect(() => service.update("0", biblioteca)).rejects.toHaveProperty("message", "La biblioteca con el ID dado no fue encontrada");
  });

  it('delete should remove a library', async () => {
    const biblioteca: BibliotecaEntity = bibliotecasList[0];
    await service.delete(biblioteca.id);
    
    const deletedBiblioteca: BibliotecaEntity| null = await repository.findOne({ where: { id: biblioteca.id } });
    expect(deletedBiblioteca).toBeNull();
  });

  it('delete should throw an exception for an invalid library', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La biblioteca con el ID dado no fue encontrada");
  });
});