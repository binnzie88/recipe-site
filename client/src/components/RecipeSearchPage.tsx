import axios from 'axios';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { RecipeCard } from './RecipeCard';
import { RecipeSearchFilters } from './RecipeSearchFilters';
import { CategoryTags, DietaryTags, DifficultyTags } from '../consts';
import { RecipeEntry, Tag } from '../types';
import {
  getLoadingRecipeCards,
  isRecipeVisibleWithSelectedTags
} from '../utils';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/RecipeSearchPage.module.scss';

export const RecipeSearchPage = () => {
  // State init/management
  const [recipes, setRecipes] = useState<RecipeEntry[] | undefined>(undefined);
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<Tag[]>([]);
  const [selectedDifficultyTags, setSelectedDifficultyTags] = useState<Tag[]>([]);
  const [selectedCategoryTags, setSelectedCategoryTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const updateSearchTerm = useCallback(() => {
    const newSearchTerm = (document.getElementById("searchInput") as HTMLInputElement).value;
    setSearchTerm(newSearchTerm);
  }, [setSearchTerm]);

  // Get recipes from the server
  useEffect(() => {
    axios.get('https://www.justabunchofrecipes.com/api/recipes').then((response) => {
      if (response.data.error != null) {
        console.log("Error received from database, please try again later.");
        console.log(response.data.error);
        setRecipes([]);
      } else {
        setRecipes(response.data.recipes ?? [] as RecipeEntry[]);
      }
    }).catch((e) => {
      console.log("Error fetching recipes, please try again later.");
      console.log(e);
      setRecipes([]);
    });
  }, []);

  // Default select any tags passed in via url params
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const urlTags = useMemo(() => urlParams.getAll("tag"), [urlParams]);
  useEffect(() => {
    const urlDietaryTags: Tag[] = [];
    const urlDifficultyTags: Tag[] = [];
    const urlCategoryTags: Tag[] = [];
    urlTags.forEach((tag) => {
      const typedTag = tag as Tag;
      if (DietaryTags.includes(typedTag)) {
        urlDietaryTags.push(typedTag);
      } else if (DifficultyTags.includes(typedTag)) {
        urlDifficultyTags.push(typedTag);
      } else if (CategoryTags.includes(typedTag)) {
        urlCategoryTags.push(typedTag);
      }
    });
    setSelectedDietaryTags(urlDietaryTags);
    setSelectedDifficultyTags(urlDifficultyTags);
    setSelectedCategoryTags(urlCategoryTags);
  }, [urlTags]);

  // Filter recipes by selected tags and search term
  const filteredRecipes = useMemo(() => {
    return recipes == null ? undefined : recipes.filter((recipe) => {
      const matchesSelectedTags = isRecipeVisibleWithSelectedTags(
        recipe.tags,
        selectedDietaryTags,
        selectedDifficultyTags,
        selectedCategoryTags
      );
      const matchesSearchTerm = 
        searchTerm.trimEnd() === ""
        || recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
        || recipe.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSelectedTags && matchesSearchTerm;
    })
  }, [recipes, selectedDietaryTags, selectedDifficultyTags, selectedCategoryTags, searchTerm]);

  // Build recipe cards for filtered recipes
  const recipeCards = useMemo(() => {
    if (filteredRecipes == null) {
      // Display loading states for recipe cards
      return getLoadingRecipeCards();
    } else {
      return filteredRecipes.map((recipe, idx) => <RecipeCard key={idx} recipe={recipe} />);
    }
  }, [filteredRecipes]);

  // Display search page
  return (
    <div className={styles.recipeSearchPageTop}>
      <Header isScrollable={false} />
      <main className={classNames(sharedStyles.pageContainer, styles.searchPageContainer)}>
        <div className={styles.recipesPageBackground}>
        <section className={styles.recipes}>
          <div className={classNames(
            sharedStyles.topContainer,
            sharedStyles.expandOnSmallScreens,
            styles.searchTopContainer
          )}>
            <div className={styles.recipesContainer}>
              <RecipeSearchFilters
                updateSearchTermCallback={updateSearchTerm}
                urlTags={urlTags}
                setSelectedDietaryTagsCallback={setSelectedDietaryTags}
                setSelectedDifficultyTagsCallback={setSelectedDifficultyTags}
                setSelectedCategoryTagsCallback={setSelectedCategoryTags}
              />
              <div className={styles.resultsSection}>
                <div className={styles.resultsContainer}>
                  {recipeCards}
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}