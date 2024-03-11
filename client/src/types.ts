/* Dietary Selections */

export enum DietarySelection {
  Original = "original",
  Vegetarian = "vegetarian-sub",
  Vegan = "vegan-sub",
  GlutenFree = "gluten-free-sub",
}

export const DietarySelections = [
  DietarySelection.Vegetarian,
  DietarySelection.Vegan,
  DietarySelection.GlutenFree,
];

export const DietarySelectionButtonText = new Map<DietarySelection, string>([
  [DietarySelection.Original, "Original Recipe"],
  [DietarySelection.Vegetarian, "Make Vegetarian"],
  [DietarySelection.Vegan, "Make Vegan"],
  [DietarySelection.GlutenFree, "Make Gluten-Free"],
]);

export const DietarySelectionIndices = new Map<DietarySelection, number>([
  [DietarySelection.Original, 0],
  [DietarySelection.Vegetarian, 1],
  [DietarySelection.Vegan, 2],
  [DietarySelection.GlutenFree, 3],
]);

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

/* Tag Details */

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

export const TagButtonText = new Map<Tag, string>([
  [Tag.Vegan, "Vegan"],
  [Tag.VeganSubstitute, "Vegan Substitute"],
  [Tag.Vegetarian, "Vegetarian"],
  [Tag.VegetarianSubstitute, "Vegetarian Substitute"],
  [Tag.GlutenFree, "Gluten-Free"],
  [Tag.GlutenFreeSubstitute, "Gluten-Free Substitute"],
  [Tag.Easy, "Easy"],
  [Tag.Intermediate, "Intermediate"],
  [Tag.Difficult, "Difficult"],
  [Tag.Hot, "Hot"],
  [Tag.Cold, "Cold"],
  [Tag.Entree, "Entrees"],
  [Tag.SideSnack, "Sides/Snacks"],
  [Tag.Dessert, "Desserts"],
  [Tag.Bread, "Bread"],
  [Tag.Drink, "Drinks"],
]);

/* Tag Categories */

export const CategoryTags = [
  Tag.Hot,
  Tag.Cold,
  Tag.Entree,
  Tag.SideSnack,
  Tag.Dessert,
  Tag.Bread,
  Tag.Drink,
]

export const DietaryTags = [
  Tag.Vegan,
  Tag.Vegetarian,
  Tag.GlutenFree,
  Tag.VeganSubstitute,
  Tag.VegetarianSubstitute,
  Tag.GlutenFreeSubstitute,
];

/***
 * DietaryFilterTags is used only for displaying filter checkboxes on the
 * recipe search page. When a user selects a dietary filter checkbox, the
 * substitute version of that dietary restriction is automatically included.
 */
export const DietaryFilterTags = [
  Tag.Vegan,
  Tag.Vegetarian,
  Tag.GlutenFree,
];

export const DifficultyTags = [
  Tag.Easy,
  Tag.Intermediate,
  Tag.Difficult,
];
