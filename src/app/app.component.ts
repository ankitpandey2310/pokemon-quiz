import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pokemon } from './interfaces/pokemon.interface';
import { Response } from './interfaces/response.interface';
import { PokemonService } from './services/pokemon.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { QUIZ_QUESTION_LIMIT } from './constants/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  response: Response;
  answerClicked: boolean = false;
  nextPokemonClicked: boolean = false;
  subscription: Subscription | null = null;
  loading: boolean = false;
  correctAnswered: number = 0;
  totalAttempted: number = 0;
  imageLoader: boolean = true;
  showError: boolean = false;
  finishQuiz: boolean = false;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadQuiz();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Function to fetch data and load quiz
   */
  loadQuiz() {
    this.subscription = this.pokemonService
      .fetchPokemons()
      .subscribe((res: any) => {
        this.response = res;
        this.resetState();
        this.loading = true;
        this.imageLoader = true;
        if (res.error) {
          this.showError = true;
        }
      });
  }

  /**
   * Function is called when user clicks on any answer and set necessary flags
   * @param pokemon clicked option out of available options
   */
  clickAnswer(pokemon: Pokemon): void {
    this.answerClicked = true;
    pokemon.status = true;
    this.totalAttempted += 1;
    this.correctAnswered =
      pokemon.correctAnswer === true
        ? this.correctAnswered + 1
        : this.correctAnswered;
  }

  /**
   * Function is called when used clicks to next question
   */
  nextPokemon(): void {
    if (this.totalAttempted >= QUIZ_QUESTION_LIMIT) {
      this.finishQuiz = true;
    }else{
      this.nextPokemonClicked = true;
      this.loadQuiz();
    }
  }

  /**
   * Function used to reset values as soon as new question arrives
   */
  resetState(): void {
    this.answerClicked = false;
    this.nextPokemonClicked = false;
  }

  /**
   * To display loader while image is loading
   * @param e event details of image
   */
  onImageLoad(e: any) {
    this.imageLoader = false;
  }

  /**
   * Restarts the Quiz
   */
  restartQuiz(){
    this.totalAttempted = 0;
    this.correctAnswered = 0;
    this.loadQuiz();
    setTimeout(() => {
      this.finishQuiz = false;
    }, 1000);
  }
}