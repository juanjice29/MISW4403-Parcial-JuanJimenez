import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';

@Entity()
export class LibroEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  autor: string;

  @Column()
  fechaPublicacion: string;

  @Column()
  isbn: string;

  @ManyToMany(() => BibliotecaEntity, (biblioteca) => biblioteca.libros)
  bibliotecas: BibliotecaEntity[];
}
