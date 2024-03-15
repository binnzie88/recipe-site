/* Dietary Selections */

export enum DietarySelection {
  Original = "original",
  Vegetarian = "vegetarian-sub",
  Vegan = "vegan-sub",
  GlutenFree = "gluten-free-sub",
}

/* Recipe Props */

export interface RecipeEntry {
  id: string;
  image: string;
  ingredients: string[][];
  notes: string[];
  steps: string[][];
  subtitle: string;
  tags: string[];
  time: string;
  title: string;
}

/* Tags */

export enum Tag {
  Vegan = "vegan",
  VeganSubstitute = "vegan-sub",
  Vegetarian = "vegetarian",
  VegetarianSubstitute = "vegetarian-sub",
  GlutenFree = "gluten-free",
  GlutenFreeSubstitute = "gluten-free-sub",
  Easy = "easy",
  Intermediate = "intermediate",
  Difficult = "difficult",
  Hot = "hot",
  Cold = "cold",
  Entree = "entree",
  SideSnack = "side-snack",
  Dessert = "dessert",
  Bread = "bread",
  Drink = "drink",
}