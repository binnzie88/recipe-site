import axios from 'axios';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import {
  CategoryTags,
  DietaryFilterTags,
  DietaryTags,
  DifficultyTags,
  RecipeEntry,
  Tag,
  TagButtonText
} from '../types';
import {
  createTagFilter,
  getDietaryRestrictionAndSubstitute,
  isRecipeVisibleWithSelectedTags,
  setSelectedTags } from '../utils';
import styles from '../styles/RecipeSearchPage.module.scss';
import sharedStyles from '../styles/CommonStyles.module.scss';

export const RecipeSearchPage = () => {
  // State init/management
  const [recipes, setRecipes] = useState<RecipeEntry[]>([]);
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
    axios.get('http://localhost:9000/recipes').then((response) => {
      if (response.data.error != null) {
        // TODO: show reasonable error page
      } else {
        setRecipes(response.data.recipes ?? [] as RecipeEntry[]);
      }
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
    return recipes.filter((recipe) => {
      const matchesSelectedTags = isRecipeVisibleWithSelectedTags(recipe.tags, selectedDietaryTags, selectedDifficultyTags, selectedCategoryTags);
      const matchesSearchTerm = 
        searchTerm.trimEnd() === ""
        || recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
        || recipe.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSelectedTags && matchesSearchTerm;
    })
  }, [recipes, selectedDietaryTags, selectedDifficultyTags, selectedCategoryTags, searchTerm]);

  // Build recipe cards for filtered recipes
  const recipeCards = useMemo(() => {
    return filteredRecipes.map((recipe) => {
      const imageSplit = recipe.image.split(".");
      const recipeUrl = "../recipe/" + recipe.id;
      const recipeTags = recipe.tags.map((tag, idx) => {
        const maybeComma = idx < recipe.tags.length - 1 ? ",\xa0" : "";
        return (<li key={tag}><a href={"?tag=" + tag}>{tag}</a>{maybeComma}</li>);
      });

      return (
        <div className={classNames(styles.entryContainer, "col-med-12")}>
          <article className={classNames(styles.entry, "row")}>
            <div className="col-2">
              <a href={recipeUrl}><img src={require("./../img/" + imageSplit[0] + "_sq." + imageSplit[1])} alt="" className="img-fluid" /></a>
            </div>
            <div className="col-10">
              <h2 className={styles.entryTitle}>
                <a href={recipeUrl}>{recipe.title}</a>
              </h2>
              <div className={styles.entryContent}>
                <p>
                  {recipe.subtitle}
                </p>
              </div>
              <div className={classNames(styles.entryCardFooter, sharedStyles.entryFooter)}>
                <div className={classNames(styles.entryTags, sharedStyles.tagsContainer)}>
                  <i className="material-icons">local_offer</i>
                  <ul className={sharedStyles.tags}>
                    {recipeTags}
                  </ul>
                </div>
                <div className={styles.viewRecipeContainer}>
                  <div className={styles.viewRecipe}>
                    <a href={recipeUrl}>View Recipe</a>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      );
    });
  }, [filteredRecipes]);

  // Build filter checkboxes (for both wide and narrow screens)
  // TODO: pull this out into a util
  const dietaryTagChecks = useMemo(() => DietaryFilterTags.map((tag) =>
    createTagFilter(
      tag,
      "dietary-tag-checkbox",
      () => setSelectedTags("dietary-tag-checkbox", setSelectedDietaryTags),
      getDietaryRestrictionAndSubstitute(tag).some((t) => urlTags.includes(t)),
      TagButtonText.get(tag) ?? ""
    )
  ), [setSelectedDietaryTags, urlTags]);
  const dietaryTagChecksSmall = useMemo(() => DietaryFilterTags.map((tag) =>
    createTagFilter(
      tag,
      "dietary-tag-checkbox-sm",
      () => setSelectedTags("dietary-tag-checkbox-sm", setSelectedDietaryTags),
      getDietaryRestrictionAndSubstitute(tag).some((t) => urlTags.includes(t)),
      TagButtonText.get(tag) ?? ""
    )
  ), [setSelectedDietaryTags, urlTags]);

  const difficultyTagChecks = useMemo(() => DifficultyTags.map((tag) =>
    createTagFilter(
      tag,
      "difficulty-tag-checkbox",
      () => setSelectedTags("difficulty-tag-checkbox",
      setSelectedDifficultyTags),
      urlTags.includes(tag),
      TagButtonText.get(tag) ?? ""
    )
  ), [setSelectedDifficultyTags, urlTags]);
  const difficultyTagChecksSmall = useMemo(() => DifficultyTags.map((tag) =>
    createTagFilter(
      tag,
      "difficulty-tag-checkbox-sm",
      () => setSelectedTags("difficulty-tag-checkbox-sm", setSelectedDifficultyTags),
      urlTags.includes(tag),
      TagButtonText.get(tag) ?? ""
    )
  ), [setSelectedDifficultyTags, urlTags]);

  const categoryTagChecks = useMemo(() => CategoryTags.map((tag) =>
    createTagFilter(
      tag,
      "category-tag-checkbox",
      () => setSelectedTags("category-tag-checkbox", setSelectedCategoryTags),
      urlTags.includes(tag),
      TagButtonText.get(tag) ?? ""
    )
  ), [setSelectedCategoryTags, urlTags]);
  const categoryTagChecksSmall = useMemo(() => CategoryTags.map((tag) =>
    createTagFilter(
      tag,
      "category-tag-checkbox-sm",
      () => setSelectedTags("category-tag-checkbox-sm", setSelectedCategoryTags),
      urlTags.includes(tag),
      TagButtonText.get(tag) ?? ""
    )
  ), [setSelectedCategoryTags, urlTags]);

  // Display search page
  // TODO: break out parts of this into helper functions
  return (
    <div className={styles.recipeSearchPageTop}>
      <Header isScrollable={false} />
      <main className={classNames(sharedStyles.pageContainer, styles.searchPageContainer)}>
        <div className={styles.recipesPageBackground}>
        <section className={styles.recipes}>
          <div className={classNames(sharedStyles.topContainer, sharedStyles.expandOnSmallScreens, styles.searchTopContainer)}>
            <div className={styles.recipesContainer}>
              <div className={styles.sidebarSection}>
                <div className={styles.sidebar}>
                  <h3 className={classNames("d-none", "d-lg-block", styles.sidebarTitle)}>Search</h3>
                  <div className={styles.searchContainer}>
                    <h3 className={classNames("d-lg-none", styles.sidebarTitle, styles.sidebarTitleSm)}>Search</h3>
                    <div className={styles.searchForm}>
                      <input type="text" id="searchInput" />
                      <button type="submit" onClick={updateSearchTerm}><i className="material-icons">search</i></button>
                    </div>
                    <button type="button" data-toggle="collapse" data-target="#filters-collapsed" className={classNames(styles.filterButton, "d-lg-none", "btn", "btn-primary")}>
                      Filters
                      <i className={classNames("material-icons", styles.filterButtonIcon)}>keyboard_arrow_down</i>
                    </button>
                  </div>
                  <div className="d-lg-none">
                    <div className={classNames(styles.sidebarItem, styles.filtersSm, "collapse", "row")} id="filters-collapsed">
                      <div className="col">
                        <div className={classNames("row", styles.filterHeaderRow)}>
                          <h2 className={styles.sidebarSubtitle}>Dietary Restrictions</h2>
                          <div className={styles.tooltipAnchor}>
                            <i className={classNames(styles.infoIcon, "material-icons")}>info</i>
                            <span className={styles.tooltipText}>
                              {"Search results will only include recipes that match (or provide substitutions for) all selected dietary restrictions."}
                            </span>
                          </div>
                        </div>
                        <ul className={styles.tagCheckboxes}>
                          {dietaryTagChecksSmall}
                        </ul>
                      </div>
                      <div className="col">
                        <div className={classNames("row", styles.filterHeaderRow)}>
                          <h2 className={styles.sidebarSubtitle}>Difficulty</h2>
                          <div className={styles.tooltipAnchor}>
                            <i className={classNames(styles.infoIcon, "material-icons")}>info</i>
                            <span className={styles.tooltipText}>
                              {"Search results will include recipes that match any selected difficulty levels."}
                            </span>
                          </div>
                        </div>
                        <ul className={styles.tagCheckboxes}>
                          {difficultyTagChecksSmall}
                        </ul>
                      </div>
                      <div className="col">
                        <div className={classNames("row", styles.filterHeaderRow)}>
                          <h2 className={styles.sidebarSubtitle}>Other</h2>
                          <div className={styles.tooltipAnchor}>
                            <i className={classNames(styles.infoIcon, "material-icons")}>info</i>
                            <span className={styles.tooltipText}>
                              {"Search results will include recipes that match any selected tags in this category."}
                            </span>
                          </div>
                        </div>
                        <ul className={styles.tagCheckboxes}>
                          {categoryTagChecksSmall}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={classNames("d-none", "d-lg-block", styles.sidebarItem)}>
                    <h2 className={styles.sidebarTitle}>Filters</h2>
                    <div className={classNames("row", styles.filterHeaderRow)}>
                      <h2 className={styles.sidebarSubtitle}>Dietary Restrictions</h2>
                      <div className={styles.tooltipAnchor}>
                        <i className={classNames(styles.infoIcon, "material-icons")}>info</i>
                        <span className={classNames(styles.tooltipText, styles.sidebarTooltip)}>
                          {"Search results will only include recipes that match (or provide substitutions for) all selected dietary restrictions."}
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <ul className={styles.tagCheckboxes}>
                        {dietaryTagChecks}
                      </ul>
                    </div>
                    <div className={classNames("row", styles.filterHeaderRow)}>
                      <h2 className={styles.sidebarSubtitle}>Difficulty</h2>
                      <div className={styles.tooltipAnchor}>
                        <i className={classNames(styles.infoIcon, "material-icons")}>info</i>
                        <span className={classNames(styles.tooltipText, styles.sidebarTooltip)}>
                          {"Search results will only include recipes that match all selected dietary restrictions."}
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <ul className={styles.tagCheckboxes}>
                        {difficultyTagChecks}
                      </ul>
                    </div>
                    <div className={classNames("row", styles.filterHeaderRow)}>
                      <h2 className={styles.sidebarSubtitle}>Other</h2>
                      <div className={styles.tooltipAnchor}>
                        <i className={classNames(styles.infoIcon, "material-icons")}>info</i>
                        <span className={classNames(styles.tooltipText, styles.sidebarTooltip)}>
                          {"Search results will only include recipes that match all selected dietary restrictions."}
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <ul className={styles.tagCheckboxes}>
                        {categoryTagChecks}
                      </ul>
                    </div>
                  </div>
                  
                </div>
              </div>

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
