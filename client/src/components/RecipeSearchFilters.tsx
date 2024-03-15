import classNames from 'classnames';
import styles from '../styles/RecipeSearchPage.module.scss';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { createTagFilter, getDietaryRestrictionAndSubstitute, setSelectedTags } from '../utils';
import { CategoryTags, DietaryFilterTags, DifficultyTags, TagButtonText } from '../consts';
import { Tag } from '../types';

export interface RecipeSearchFiltersProps {
  updateSearchTermCallback: () => void;
  urlTags: string[];
  setSelectedDietaryTagsCallback: Dispatch<SetStateAction<Tag[]>>;
  setSelectedDifficultyTagsCallback: Dispatch<SetStateAction<Tag[]>>;
  setSelectedCategoryTagsCallback: Dispatch<SetStateAction<Tag[]>>
}

export const RecipeSearchFilters = ({
  updateSearchTermCallback,
  urlTags,
  setSelectedDietaryTagsCallback,
  setSelectedDifficultyTagsCallback,
  setSelectedCategoryTagsCallback
}: RecipeSearchFiltersProps) => {
  // Build filter checkboxes (for both wide and narrow screens)
  const [dietaryTagChecks, dietaryTagChecksSmall] = useMemo(
    () => buildDietaryTagChecks(urlTags, setSelectedDietaryTagsCallback),
    [urlTags, setSelectedDietaryTagsCallback]);
  const [difficultyTagChecks, difficultyTagChecksSmall] = useMemo(
    () => buildDifficultyTagChecks(urlTags, setSelectedDifficultyTagsCallback),
    [urlTags, setSelectedDifficultyTagsCallback]);
  const [categoryTagChecks, categoryTagChecksSmall] = useMemo(
    () => buildCategoryTagChecks(urlTags, setSelectedCategoryTagsCallback),
    [urlTags, setSelectedCategoryTagsCallback]);

  const dietaryTagsTooltip = (
    <span className={styles.tooltipText}>
      {"Search results will only include recipes that match (or provide substitutions for) all selected dietary restrictions."}
    </span>
  );
  const difficultyTagsTooltip = (
    <span className={styles.tooltipText}>
      {"Search results will include recipes that match any selected difficulty levels."}
    </span>
  );
  const categoryTagsTooltip = (
    <span className={styles.tooltipText}>
      {"Search results will include recipes that match any selected tags in this category."}
    </span>
  );

  const [dietarySection, dietarySectionSmall] = buildChecksSections(
    "Dietary Restrictions",
    dietaryTagsTooltip,
    dietaryTagChecks,
    dietaryTagChecksSmall
  );
  const [difficultySection, difficultySectionSmall] = buildChecksSections(
    "Difficulty",
    difficultyTagsTooltip,
    difficultyTagChecks,
    difficultyTagChecksSmall
  );
  const [categorySection, categorySectionSmall] = buildChecksSections(
    "Other",
    categoryTagsTooltip,
    categoryTagChecks,
    categoryTagChecksSmall
  );

  return (
    <div className={styles.sidebarSection}>
      <div className={styles.sidebar}>
        <h3 className={classNames("d-none", "d-lg-block", styles.sidebarTitle)}>{"Search"}</h3>
        <div className={styles.searchContainer}>
          <h3 className={classNames("d-lg-none", styles.sidebarTitle, styles.sidebarTitleSm)}>{"Search"}</h3>
          <div className={styles.searchForm}>
            <input type="text" id="searchInput" />
            <button type="submit" onClick={updateSearchTermCallback}><i className="material-icons">search</i></button>
          </div>
          <button
            type="button"
            data-toggle="collapse"
            data-target="#filters-collapsed"
            className={classNames(styles.filterButton, "d-lg-none", "btn", "btn-primary")}
          >
            {"Filters"}
            <i className={classNames("material-icons", styles.filterButtonIcon)}>keyboard_arrow_down</i>
          </button>
        </div>
        <div className="d-lg-none">
          <div className={classNames(styles.sidebarItem, styles.filtersSm, "collapse", "row")} id="filters-collapsed">
            {dietarySectionSmall}
            {difficultySectionSmall}
            {categorySectionSmall}
          </div>
        </div>
        <div className={classNames("d-none", "d-lg-block", styles.sidebarItem)}>
          <h2 className={styles.sidebarTitle}>{"Filters"}</h2>
          {dietarySection}
          {difficultySection}
          {categorySection}
        </div>
      </div>
    </div>
  );
}

function buildChecksSections(
  sectionTitle: string,
  tooltip: JSX.Element,
  tagChecks: JSX.Element[],
  tagChecksSmall: JSX.Element[]
) {
  const checksSection = (
    <React.Fragment>
      <div className={classNames("row", styles.filterHeaderRow)}>
        <h2 className={styles.sidebarSubtitle}>{sectionTitle}</h2>
        <div className={styles.tooltipAnchor}>
          <i className={classNames(styles.infoIcon, "material-icons")}>info</i>
          {tooltip}
        </div>
      </div>
      <div className="row">
        <ul className={styles.tagCheckboxes}>
          {tagChecks}
        </ul>
      </div>
    </React.Fragment>
  );
  const checksSectionSmall = (
    <div className="col">
      <div className={classNames("row", styles.filterHeaderRow)}>
        <h2 className={styles.sidebarSubtitle}>{sectionTitle}</h2>
        <div className={styles.tooltipAnchor}>
          <i className={classNames(styles.infoIcon, "material-icons")}>info</i>
          {tooltip}
        </div>
      </div>
      <ul className={styles.tagCheckboxes}>
        {tagChecksSmall}
      </ul>
    </div>
  );
  return [checksSection, checksSectionSmall];
}

function buildDietaryTagChecks(
  urlTags: string[],
  setSelectedDietaryTagsCallback: Dispatch<SetStateAction<Tag[]>>
) {
  const dietaryTagChecks = DietaryFilterTags.map((tag) =>
    createTagFilter(
      tag,
      "dietary-tag-checkbox",
      () => setSelectedTags("dietary-tag-checkbox", setSelectedDietaryTagsCallback),
      getDietaryRestrictionAndSubstitute(tag).some((t) => urlTags.includes(t)),
      TagButtonText.get(tag) ?? ""
    )
  );
  const dietaryTagChecksSmall = DietaryFilterTags.map((tag) =>
    createTagFilter(
      tag,
      "dietary-tag-checkbox-sm",
      () => setSelectedTags("dietary-tag-checkbox-sm", setSelectedDietaryTagsCallback),
      getDietaryRestrictionAndSubstitute(tag).some((t) => urlTags.includes(t)),
      TagButtonText.get(tag) ?? ""
    )
  );
  return [dietaryTagChecks, dietaryTagChecksSmall];
}

function buildDifficultyTagChecks(
  urlTags: string[],
  setSelectedDifficultyTagsCallback: Dispatch<SetStateAction<Tag[]>>
) {
  const difficultyTagChecks = DifficultyTags.map((tag) =>
    createTagFilter(
      tag,
      "difficulty-tag-checkbox",
      () => setSelectedTags("difficulty-tag-checkbox",
      setSelectedDifficultyTagsCallback),
      urlTags.includes(tag),
      TagButtonText.get(tag) ?? ""
    )
  );
  const difficultyTagChecksSmall = DifficultyTags.map((tag) =>
    createTagFilter(
      tag,
      "difficulty-tag-checkbox-sm",
      () => setSelectedTags("difficulty-tag-checkbox-sm", setSelectedDifficultyTagsCallback),
      urlTags.includes(tag),
      TagButtonText.get(tag) ?? ""
    )
  );
  return [difficultyTagChecks, difficultyTagChecksSmall];
}

function buildCategoryTagChecks(
  urlTags: string[],
  setSelectedCategoryTagsCallback: Dispatch<SetStateAction<Tag[]>>
) {
  const categoryTagChecks = CategoryTags.map((tag) =>
    createTagFilter(
      tag,
      "category-tag-checkbox",
      () => setSelectedTags("category-tag-checkbox", setSelectedCategoryTagsCallback),
      urlTags.includes(tag),
      TagButtonText.get(tag) ?? ""
    )
  );
  const categoryTagChecksSmall = CategoryTags.map((tag) =>
    createTagFilter(
      tag,
      "category-tag-checkbox-sm",
      () => setSelectedTags("category-tag-checkbox-sm", setSelectedCategoryTagsCallback),
      urlTags.includes(tag),
      TagButtonText.get(tag) ?? ""
    )
  );
  return [categoryTagChecks, categoryTagChecksSmall];
}