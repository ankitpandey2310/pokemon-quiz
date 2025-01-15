import { TestBed, inject } from '@angular/core/testing';
import { PokemonService } from './pokemon.service';
import { Response } from '../interfaces/response.interface';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Pokemon } from '../interfaces/pokemon.interface';

const mockApiResponse: Response = {
  results: [
    { name: 'bulbasaur', correctAnswer: true, status: false },
    { name: 'charmander', correctAnswer: false, status: false },
    { name: 'squirtle', correctAnswer: false, status: false },
    { name: 'pikachu', correctAnswer: false, status: false },
  ],
};

describe('PokemonService', () => {
   let service: PokemonService;
   let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PokemonService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([PokemonService], (service: PokemonService) => {
    expect(service).toBeTruthy();
  }));

  describe('fetchPokemons', () => {
    it('fetch pokemons from API', () => {
      spyOn(service, 'resetState').and.callThrough();
      spyOn(service, 'drawOffset').and.returnValue(42);

      service.fetchPokemons().subscribe((response) => {
        expect(response.results.length).toBe(4);
        expect(response.results[0].name).toBe('bulbasaur');
      });

      const req = httpMock.expectOne(
        'https://pokeapi.co/api/v2/pokemon/?offset=42&limit=4'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);

      expect(service.resetState).toHaveBeenCalled();
    });
  });

  describe('processResponse', () => {
    it('process API response and assign correctAnswer', () => {
      const processedResponse = service.processResponse(
        mockApiResponse
      );

      expect(processedResponse.results.length).toBe(4);
      processedResponse.results.forEach((pokemon: Pokemon) => {
        expect(pokemon.name).toBeTruthy();
        expect(pokemon.correctAnswer).toBeDefined();
        expect(pokemon.status).toBe(false);
      });
    });
  });

  describe('chooseCorrectAnswer', () => {
    it('should determine the correctAnswer field based on conditions', () => {
      service.counter = 3;
      service.correctAnswerExist = false;
      const result = service.chooseCorrectAnswer();

      expect(result).toBeTrue();
    });

    it('should return false if correctAnswerExist is true', () => {
      service.correctAnswerExist = true;
      const result = service.chooseCorrectAnswer();

      expect(result).toBeFalse();
    });
  });

  describe('drawOffset', () => {
    it('should return a random number between 0 and 1000 for offset', () => {
      const offset = service.drawOffset();

      expect(offset).toBeGreaterThanOrEqual(0);
      expect(offset).toBeLessThanOrEqual(1000);
    });
  });

  describe('resetState', () => {
    it('should reset correctAnswerExist and counter', () => {
      service.correctAnswerExist = true;
      service.counter = 10;

      service.resetState();

      expect(service.correctAnswerExist).toBeFalse();
      expect(service.counter).toBe(0);
    });
  });
  
});