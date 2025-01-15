import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { PokemonService } from './services/pokemon.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { QUIZ_QUESTION_LIMIT } from './constants/constants';


describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let pokemonServiceMock: jasmine.SpyObj<PokemonService>;

    beforeEach(waitForAsync(() => {
      pokemonServiceMock = jasmine.createSpyObj('PokemonService', [
        'fetchPokemons',
      ]);
      TestBed.configureTestingModule({
        declarations: [],
        imports: [AppComponent],
        providers: [
                PokemonService,
                provideHttpClient(),
                provideHttpClientTesting(),
              ],
      }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        pokemonServiceMock = jasmine.createSpyObj('PokemonService', [
          'fetchPokemons',
        ]);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
      it('should call loadQuiz', () => {
        spyOn(component, 'loadQuiz');
        component.ngOnInit();
        expect(component.loadQuiz).toHaveBeenCalled();
      });
    });

    describe('clickAnswer', () => {
      it('should update when correct answer is clicked', () => {
        const mockPokemon = {
          name: 'pikachu',
          correctAnswer: true,
          status: false,
        };
        component.clickAnswer(mockPokemon);

        expect(component.answerClicked).toBeTrue();
        expect(mockPokemon.status).toBeTrue();
        expect(component.totalAttempted).toBe(1);
        expect(component.correctAnswered).toBe(1);
      });

      it('should do when incorrect answer', () => {
        const mockPokemon = {
          name: 'pikachu',
          correctAnswer: false,
          status: false,
        };
        component.clickAnswer(mockPokemon);

        expect(component.answerClicked).toBeTrue();
        expect(mockPokemon.status).toBeTrue();
        expect(component.totalAttempted).toBe(1);
        expect(component.correctAnswered).toBe(0);
      });
    });

    describe('onImageLoad', () => {
      it('should set imageLoader to false', () => {
        component.onImageLoad({});
        expect(component.imageLoader).toBeFalse();
      });
    });

     describe('nextPokemon', () => {
      it('should set finishQuiz to true if totalAttempted >= QUIZ_QUESTION_LIMIT', () => {
        component.totalAttempted = QUIZ_QUESTION_LIMIT;
        component.nextPokemon();
        expect(component.finishQuiz).toBeTrue();
      });

      it('should call loadQuiz and set nextPokemonClicked to true if totalAttempted < QUIZ_QUESTION_LIMIT', () => {
        component.totalAttempted = QUIZ_QUESTION_LIMIT - 1;
        spyOn(component, 'loadQuiz');
        component.nextPokemon();
        expect(component.nextPokemonClicked).toBeTrue();
        expect(component.loadQuiz).toHaveBeenCalled();
      });
     });

});