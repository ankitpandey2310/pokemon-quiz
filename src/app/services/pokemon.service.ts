import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon.interface';
import { Response } from '../interfaces/response.interface';
import { catchError } from 'rxjs/operators'; 
import { POKEMON_API_BASE_URL, LIMIT, DRAW_OFFSET } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  correctAnswerExist: boolean = false;
  counter: number = 0;

  constructor(private http: HttpClient) {}

  /**
   * Function to fetch pokemon data
   * @returns Returns required data in quiz form after processing
   */
  fetchPokemons(): Observable<any> {
    this.resetState();
    return this.http
      .get<any>(
        POKEMON_API_BASE_URL + this.drawOffset().toString() + '&limit=' + LIMIT
      )
      .pipe(
        map((resource) => this.processResponse(resource)),
        catchError(async (error) => this.handleError(error))
      );
  }

  /**
   * Function to parse API reponse in needed structure for quiz
   * @param response Api response
   * @returns required data in quiz form
   */
  processResponse(response: Response): Response {
    return {
      results: response.results.map(
        (pokemon: any) =>
          <Pokemon>{
            name: pokemon.name,
            correctAnswer: this.chooseCorrectAnswer(),
            status: false,
          }
      ),
    };
  }

  /**
   * Function used to return error details
   * @param error
   * @returns error response
   */
  handleError(error: any): void {
    return error;
  }

  /**
   * Function used to set question with correct answer randomly
   * @returns correct answer
   */
  chooseCorrectAnswer(): boolean {
    this.counter++;
    if (this.correctAnswerExist === true) {
      return false;
    }
    if (this.correctAnswerExist === false && this.counter >= 4) {
      return true;
    }
    if (Math.random() > 0.5) {
      this.correctAnswerExist = true;
      return true;
    }
    return false;
  }

  /**
   * Function used to generate Random offset number between 1 to 1000
   * Note : We have 1301 pokemons available
   * @returns Offset for API call
   */
  drawOffset(): number {
    return Math.round(Math.random() * DRAW_OFFSET);
  }

  /**
   * Function resets flags on new question
   */
  resetState(): void {
    this.correctAnswerExist = false;
    this.counter = 0;
  }
}