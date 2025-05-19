// src/libro/libro.dto.ts
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class LibroDto {
  @IsString()
  @IsNotEmpty()
  readonly titulo: string;

  @IsString()
  @IsNotEmpty()
  readonly autor: string;

  @IsDateString()
  @IsNotEmpty()
  readonly fechaPublicacion: string;

  @IsString()
  @IsNotEmpty()
  readonly isbn: string;
}