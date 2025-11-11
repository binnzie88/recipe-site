import classNames from 'classnames';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DietarySelection, DifficultyTags, RecipeTypeTags, RecipesAndIngredientsContext } from '../types';
import {
  getLoadingRecipeCards,
  isRecipeVisibleWithSelectedTags
} from '../utils';
import { Header } from './Header';
import { Footer } from './Footer';
import { RecipeCard } from './RecipeCard';
import { RecipeSearchFilters } from './RecipeSearchFilters';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/RecipeSearchPage.module.scss';

export const RecipeSearchPage = () => {
    const [selectedDietaryTags, setSelectedDietaryTags] = useState<DietarySelection[]>([]);
    const [selectedDifficultyTags, setSelectedDifficultyTags] = useState<DifficultyTags[]>([]);
    const [selectedRecipeTypeTags, setSelectedRecipeTypeTags] = useState<RecipeTypeTags[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Display loading states for recipe cards
    const loadingCards = useMemo(() => getLoadingRecipeCards(), []);

    const { recipes } = useContext(RecipesAndIngredientsContext);

    const updateSearchTerm = useCallback(() => {
        const newSearchTerm = (document.getElementById("searchInput") as HTMLInputElement).value;
        setSearchTerm(newSearchTerm);
    }, [setSearchTerm]);

    // Default select any tags passed in via url params
    const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
    const urlTags = useMemo(() => urlParams.getAll("tag"), [urlParams]);
    useEffect(() => {
        const urlDietaryTags: DietarySelection[] = [];
        const urlDifficultyTags: DifficultyTags[] = [];
        const urlRecipeTypeTags: RecipeTypeTags[] = [];
        urlTags.forEach((tag) => {
            if (Object.values<string>(DietarySelection).includes(tag)) {
                urlDietaryTags.push(tag as DietarySelection);
            } else if (Object.values<string>(DifficultyTags).includes(tag)) {
                urlDifficultyTags.push(tag as DifficultyTags);
            } else if (Object.values<string>(RecipeTypeTags).includes(tag)) {
                urlRecipeTypeTags.push(tag as RecipeTypeTags);
            }
        });
        setSelectedDietaryTags(urlDietaryTags);
        setSelectedDifficultyTags(urlDifficultyTags);
        setSelectedRecipeTypeTags(urlRecipeTypeTags);
    }, [urlTags]);

    // Build recipe cards for all recipes so they're pre-loaded as the user filters
    const recipesWithCards = useMemo(() => {
        if (recipes === undefined || recipes.length === 0) {
            return undefined;
        } else {
            return recipes.map((recipe) => {
                return ({
                    recipe,
                    element: <RecipeCard key={`recipe-card-${recipe.id}`} recipe={recipe} />,
                });
            });
        }
    }, [recipes]);

    // Filter recipes by selected tags and search term
    const filteredRecipeCards = useMemo(() => {
        if (recipesWithCards === undefined) {
            return loadingCards;
        }
        return recipesWithCards.reduce((filteredCards, { recipe, element }) => {
            const matchesSelectedTags = isRecipeVisibleWithSelectedTags(
                recipe.tags,
                selectedDietaryTags,
                selectedDifficultyTags,
                selectedRecipeTypeTags
            );
            const matchesSearchTerm = 
                searchTerm.trimEnd() === ""
                || recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
                || recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());
            if (matchesSelectedTags && matchesSearchTerm) {
                filteredCards.push(element);
            }
            return filteredCards;
        }, [] as JSX.Element[]);
    }, [recipesWithCards, selectedDietaryTags, selectedDifficultyTags, selectedRecipeTypeTags, searchTerm]);

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
                                    selectedDietaryTags={selectedDietaryTags}
                                    selectedDifficultyTags={selectedDifficultyTags}
                                    selectedRecipeTypeTags={selectedRecipeTypeTags}
                                    setSelectedDietaryTagsCallback={setSelectedDietaryTags}
                                    setSelectedDifficultyTagsCallback={setSelectedDifficultyTags}
                                    setSelectedRecipeTypeTagsCallback={setSelectedRecipeTypeTags}
                                />
                                <div className={styles.resultsSection}>
                                    <div className={styles.resultsContainer}>
                                        {filteredRecipeCards}
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