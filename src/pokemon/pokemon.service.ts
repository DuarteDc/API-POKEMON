import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/paginatio.dto';

@Injectable()
export class PokemonService {

  private defautlLimit: number;

  constructor( @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>, private readonly configService: ConfigService ) {
      this.defautlLimit = configService.get<number>('defaultLimit');  
      console.log(this.defautlLimit);
   }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      return await this.pokemonModel.create(createPokemonDto);
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defautlLimit, offset } = paginationDto;

    return this.pokemonModel.find().limit(limit).skip(offset).sort({ no: 1 }).select('-__v');
  }

  async findOne(query: string) {

    let pokemon: Pokemon;

    if (!isNaN(+query))
      pokemon = await this.pokemonModel.findOne({ no: query });

    if (!pokemon && isValidObjectId(query))
      pokemon = await this.pokemonModel.findById(query);

    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({ name: query.toLowerCase() });

    if (!pokemon)
      throw new NotFoundException(`Pokemon with id, name or no ${query} not found`);

    return pokemon

  }

  async update(query: string, updatePokemonDto: UpdatePokemonDto) {

    try {
      const pokemon = await this.findOne(query);

      if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id ${id} not found`);
  }


  private handleExceptions(error) {
    if (error.code === 11000)
      throw new BadRequestException(`Pokemon with ${JSON.stringify(error.keyValue)} has already exist`);

    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
}
