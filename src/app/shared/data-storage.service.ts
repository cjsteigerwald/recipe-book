import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private fbUrl =
    'https://ng-course-recipe-book-3d4b7.firebaseio.com/recipes.json';
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService
  ) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    // with FireBase 'PUT' allows override of currently
    // stored 'recpies' in DB. IE any data will be overwritten
    this.http.put(this.fbUrl, recipes).subscribe((response) => {
      console.log(response);
    });
  } // end storeRecipes()

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.fbUrl).pipe(
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        this.recipesService.setRecipes(recipes);
      })
    );
  } // end fetchRecipes()
} // end DataStorageService{}
