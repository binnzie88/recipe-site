/* Dietary Selections */

import { DietarySelection, RecipeInfo } from "./types";

export const DietarySelectionButtonText = new Map<DietarySelection, string>([
    [DietarySelection.Original, "Original Recipe"],
    [DietarySelection.Vegetarian, "Make Vegetarian"],
    [DietarySelection.Vegan, "Make Vegan"],
    [DietarySelection.GlutenFree, "Make Gluten-Free"],
]);

/* Recipe Loading State */

export const LoadingRecipe: RecipeInfo = {
    name: 'Loading...',
    id: 'loading',
    description: 'Loading...',
    notes: ['Loading...'],
    ingredients: [{ item: 'Loading...' }],
    steps: [ {item: 'Loading...'} ],
    time: "Loading...",
}

export const COMING_SOON_IMAGE = `coming_soon_image_url`;

export const NUTRITION_ITEMS = ['calories', 'proteinG', 'fiberG', 'fatG', 'sodiumMg', 'sugarG'];

export const DIETARY_TAGS = [`glutenFree`, `vegan`, `vegetarian`];
export const DIFFICULTY_TAGS = [`easy`, `intermediate`, `difficult`];
export const RECIPE_TYPE_TAGS = [`entree`, `snack`, `bread`, `dessert`, `drink`];
