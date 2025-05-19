/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from '../../biblioteca/biblioteca.entity';
import { LibroEntity } from '../../libro/libro.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [LibroEntity,BibliotecaEntity],
   synchronize: true,   
 }),
 TypeOrmModule.forFeature([LibroEntity,BibliotecaEntity]),
];
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/