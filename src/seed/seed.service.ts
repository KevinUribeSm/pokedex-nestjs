import axios, { AxiosInstance } from 'axios';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ) {}


  async executeSeed(){

    await this.pokemonModel.deleteMany({});

    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=600&offset=0'); 

    const pokeToInsert: {name: string, no: number}[] = [];
  
    data.results.forEach(async ({name, url}) => {
      
      const array = url.split('/');
      const no:number = +array[ array.length - 2];

      pokeToInsert.push({ name, no });

    });

    await this.pokemonModel.insertMany(pokeToInsert);


    return {'Msg':'Seed correcto'};
  }
}


