import React from "react";
import { FirebaseStorage } from "firebase/storage";
import { CollectionReference } from "firebase/firestore";
import { DIETARY_TAGS, DIFFICULTY_TAGS, NUTRITION_ITEMS, RECIPE_TYPE_TAGS } from "./consts";

/* Context */

export const RecipesAndIngredientsContext = React.createContext({
    appStorage: undefined as FirebaseStorage | undefined,
    recipes: undefined as RecipeInfo[] | undefined,
    recipesCollection: undefined as CollectionReference | undefined,
    ingredients: undefined as Ingredient[] | undefined,
    ingredientsCollection: undefined as CollectionReference | undefined,
});

/* Dietary Selections */

export enum DietarySelection {
    Original = 'original',
    GlutenFree = 'glutenFree',
    Vegan = 'vegan',
    Vegetarian = 'vegetarian',
}

export const DietarySelectionLabelsMap = new Map<DietarySelection, string>([
    [DietarySelection.GlutenFree, "Gluten-Free"],
    [DietarySelection.Vegan, "Vegan"],
    [DietarySelection.Vegetarian, "Vegetarian"],
]);

/* Tags */

export enum DifficultyTags {
    Easy = 'easy',
    Intermediate = 'intermediate',
    Difficult = 'difficult',
}

export const DifficultyTagLabelsMap = new Map<DifficultyTags, string>([
    [DifficultyTags.Easy, "Easy"],
    [DifficultyTags.Intermediate, "Intermediate"],
    [DifficultyTags.Difficult, "Difficult"],
]);

export enum RecipeTypeTags {
    Entree = 'entree',
    Snack = 'snack',
    Bread = 'bread',
    Dessert = 'dessert',
    Drink = 'drink',
}

export const RecipeTypeTagLabelsMap = new Map<RecipeTypeTags, string>([
    [RecipeTypeTags.Entree, "Entrees"],
    [RecipeTypeTags.Snack, "Snacks"],
    [RecipeTypeTags.Bread, "Breads"],
    [RecipeTypeTags.Dessert, "Desserts"],
    [RecipeTypeTags.Drink, "Drink"],
]);

export type Tags = DifficultyTags | RecipeTypeTags | DietarySelection;

/* Nutrition Info */

export type NutritionItem = {
    original?: number;
    glutenFree?: number;
    vegan?: number;
    vegetarian?: number;
}

export type NutritionStringItem = {
    original?: string;
    glutenFree?: string;
    vegan?: string;
    vegetarian?: string;
}

export enum NutritionItemTypes {
    Calories = 'calories',
    ProteinG = 'proteinG',
    FiberG = 'fiberG',
    FatG = 'fatG',
    SodiumMg = 'sodiumMg',
    SugarG = 'sugarG',
}

export const NutritionItemLabelText = new Map<NutritionItemTypes, string>([
    [NutritionItemTypes.Calories, "Calories"],
    [NutritionItemTypes.ProteinG, "Protein (g)"],
    [NutritionItemTypes.FiberG, "Fiber (g)"],
    [NutritionItemTypes.FatG, "Fat (g)"],
    [NutritionItemTypes.SodiumMg, "Sodium (mg)"],
    [NutritionItemTypes.SugarG, "Sugar (g)"],
]);

export type DietaryNutritionInfo = {
    calories?: NutritionItem;
    proteinG?: NutritionItem;
    fiberG?: NutritionItem;
    fatG?: NutritionItem;
    sodiumMg?: NutritionItem;
    sugarG?: NutritionItem;
    numServings?: NutritionItem;
    servingSize?: NutritionStringItem;
}

/* Recipe and Ingredient Props */

export type IngredientOrStep = {
    item: string,
    glutenFreeSub?: string,
    veganSub?: string,
    vegetarianSub?: string,
    subItems?: IngredientOrStep[],
}

export type RecipeInfo = {
    name: string,
    id: string,
    description?: string,
    dietaryOptions?: DietarySelection[],
    notes?: string[],
    ingredients: IngredientOrStep[],
    steps: IngredientOrStep[],
    tags?: Tags[],
    time?: string,
    servingSize?: string,
    numServings?: string,
    nutritionInfo?: DietaryNutritionInfo,
    imageUrl?: string,
    thumbnailImageUrl?: string,
}

export type Ingredient = {
    name: string,
    id: string,
    servingSize: string,
    nutritionInfo?: DietaryNutritionInfo,
}

/* Recipe Suggestion Page Types */
export type SubIngredientOrStepInput = {
    item: string;
    glutenFreeSub: string;
    veganSub: string;
    vegetarianSub: string;
}

export type IngredientOrStepInput = SubIngredientOrStepInput & {
    subItems: SubIngredientOrStepInput[];
}

export function isSubIngredientOrStepInput(
    input: IngredientOrStepInput | SubIngredientOrStepInput
): input is IngredientOrStepInput {
    return "subItems" in input;
}

export type NutritionItemInput = {
    original: number;
    glutenFree: number;
    vegan: number;
    vegetarian: number;
}

export type NutritionInfoInputs = Record<typeof NUTRITION_ITEMS[number], NutritionItemInput>;

export type TagInputs = 
    Record<typeof DIETARY_TAGS[number] | typeof DIFFICULTY_TAGS[number] | typeof RECIPE_TYPE_TAGS[number], boolean>;

export type Inputs = {
    name: string;
    id: string;
    description: string;
    notes: { note: string }[];
    ingredients: IngredientOrStepInput[];
    steps: IngredientOrStepInput[];
    tags: TagInputs;
    time: string;
    servingSize: string;
    numServings: string;
    nutritionInfo: NutritionInfoInputs;
    image: FileList;
}

export type FormattedIngredientsOrStepsWithSubs = {
    items: IngredientOrStep[];
    hasGlutenFreeSub: boolean;
    hasVeganSub: boolean;
    hasVegetarianSub: boolean;
}