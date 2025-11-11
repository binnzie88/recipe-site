import classNames from 'classnames';
import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import {
    DietarySelection,
    DietarySelectionLabelsMap,
    DifficultyTagLabelsMap,
    DifficultyTags,
    RecipeTypeTagLabelsMap,
    RecipeTypeTags,
} from '../types';
import styles from '../styles/RecipeSearchPage.module.scss';

export interface RecipeSearchFiltersProps {
    updateSearchTermCallback: () => void;
    selectedDietaryTags: DietarySelection[];
    selectedDifficultyTags: DifficultyTags[];
    selectedRecipeTypeTags: RecipeTypeTags[];
    setSelectedDietaryTagsCallback: Dispatch<SetStateAction<DietarySelection[]>>;
    setSelectedDifficultyTagsCallback: Dispatch<SetStateAction<DifficultyTags[]>>;
    setSelectedRecipeTypeTagsCallback: Dispatch<SetStateAction<RecipeTypeTags[]>>
}

export const RecipeSearchFilters = ({
    updateSearchTermCallback,
    selectedDietaryTags,
    selectedDifficultyTags,
    selectedRecipeTypeTags,
    setSelectedDietaryTagsCallback,
    setSelectedDifficultyTagsCallback,
    setSelectedRecipeTypeTagsCallback,
}: RecipeSearchFiltersProps) => {
    const onDietaryTagCheckboxChange = useCallback((tag: DietarySelection) => {
        setSelectedDietaryTagsCallback((prevTags) => {
            const idx = prevTags.indexOf(tag);
            if (idx === -1) {
                return [...prevTags, tag];
            } else {
                const newTags = [...prevTags];
                newTags.splice(idx);
                return newTags;
            }
        });
    }, [setSelectedDietaryTagsCallback]);

    const onDifficultyTagCheckboxChange = useCallback((tag: DifficultyTags) => {
        setSelectedDifficultyTagsCallback((prevTags) => {
            const idx = prevTags.indexOf(tag);
            if (idx === -1) {
                return [...prevTags, tag];
            } else {
                const newTags = [...prevTags];
                newTags.splice(idx);
                return newTags;
            }
        });
    }, [setSelectedDifficultyTagsCallback]);

    const onRecipeTypeTagCheckboxChange = useCallback((tag: RecipeTypeTags) => {
        setSelectedRecipeTypeTagsCallback((prevTags) => {
            const idx = prevTags.indexOf(tag);
            if (idx === -1) {
                return [...prevTags, tag];
            } else {
                const newTags = [...prevTags];
                newTags.splice(idx);
                return newTags;
            }
        });
    }, [setSelectedRecipeTypeTagsCallback]);

    // Build filter checkboxes (for both wide and narrow screens)
    const [dietaryTagChecks, dietaryTagChecksSmall] = useMemo(
        () => buildDietaryTagChecks(selectedDietaryTags, onDietaryTagCheckboxChange),
    [selectedDietaryTags, onDietaryTagCheckboxChange]);

    const [difficultyTagChecks, difficultyTagChecksSmall] = useMemo(
        () => buildDifficultyTagChecks(selectedDifficultyTags, onDifficultyTagCheckboxChange),
    [selectedDifficultyTags, onDifficultyTagCheckboxChange]);

    const [recipeTypeTagChecks, recipeTypeTagChecksSmall] = useMemo(
        () => buildRecipeTypeTagChecks(selectedRecipeTypeTags, onRecipeTypeTagCheckboxChange),
    [selectedRecipeTypeTags, onRecipeTypeTagCheckboxChange]);

    const dietaryTagsTooltip = useMemo(() => (
        <span className={styles.tooltipText}>
            {"Search results will only include recipes that match (or provide substitutions for) all selected dietary restrictions."}
        </span>
    ), []);

    const difficultyTagsTooltip = useMemo(() => (
        <span className={styles.tooltipText}>
            {"Search results will include recipes that match any selected difficulty levels."}
        </span>
    ), []);

    const recipeTypeTagsTooltip = useMemo(() => (
        <span className={styles.tooltipText}>
            {"Search results will include recipes that match any selected tags in this category."}
        </span>
    ), []);

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

    const [recipeTypeSection, recipeTypeSectionSmall] = buildChecksSections(
        "Other",
        recipeTypeTagsTooltip,
        recipeTypeTagChecks,
        recipeTypeTagChecksSmall
    );

    return (
        <div className={styles.sidebarSection} key={`search-filters-container`}>
            <div className={styles.sidebar}>
                <h3 className={classNames("d-none", "d-lg-block", styles.sidebarTitle)}>{"Search"}</h3>
                <div className={styles.searchContainer}>
                    <h3 className={classNames("d-lg-none", styles.sidebarTitle, styles.sidebarTitleSm)}>{"Search"}</h3>
                    <div className={styles.searchForm}>
                        <input type="text" id="searchInput" onKeyUp={updateSearchTermCallback}/>
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
                        {recipeTypeSectionSmall}
                    </div>
                </div>
                <div className={classNames("d-none", "d-lg-block", styles.sidebarItem)}>
                    <h2 className={styles.sidebarTitle}>{"Filters"}</h2>
                    {dietarySection}
                    {difficultySection}
                    {recipeTypeSection}
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

function getDietaryChecks(
    dietaryTags: DietarySelection[],
    onDietaryTagCheckboxChange: (tag: DietarySelection) => void,
    isSmall: boolean,
) {
    return Object.values(DietarySelection).reduce((checks, tag) => {
        if (tag !== DietarySelection.Original) {
            checks.push(
                <TagFilter
                    key={`tag${isSmall ? '-sm' : ''}-${tag}`}
                    inputClassName={`dietary-tag-checkbox${isSmall ? '-sm' : ''}`}
                    inputId={`tag${isSmall ? '-sm' : ''}-${tag}`}
                    onChange={() => onDietaryTagCheckboxChange(tag)}
                    isChecked={dietaryTags.includes(tag)}
                    buttonText={DietarySelectionLabelsMap.get(tag) ?? ""}
                />
            );
        }
        return checks;
    }, [] as JSX.Element[]);
}

function buildDietaryTagChecks(
    dietaryTags: DietarySelection[],
    onDietaryTagCheckboxChange: (tag: DietarySelection) => void,
) {
    const dietaryTagChecks = getDietaryChecks(dietaryTags, onDietaryTagCheckboxChange, false);
    const dietaryTagChecksSmall = getDietaryChecks(dietaryTags, onDietaryTagCheckboxChange, true);
    return [dietaryTagChecks, dietaryTagChecksSmall];
}

function getDifficultyChecks(
    difficultyTags: DifficultyTags[],
    onDifficultyTagCheckboxChange: (tag: DifficultyTags) => void,
    isSmall: boolean,
) {
    return Object.values(DifficultyTags).map((tag) =>
        <TagFilter
            key={`tag${isSmall ? '-sm' : ''}-${tag}`}
            inputClassName={`difficulty-tag-checkbox${isSmall ? '-sm' : ''}`}
            inputId={`tag${isSmall ? '-sm' : ''}-${tag}`}
            onChange={() => onDifficultyTagCheckboxChange(tag)}
            isChecked={difficultyTags.includes(tag)}
            buttonText={DifficultyTagLabelsMap.get(tag) ?? ""}
        />
    );
}

function buildDifficultyTagChecks(
    difficultyTags: DifficultyTags[],
    onDifficultyTagCheckboxChange: (tag: DifficultyTags) => void,
) {
    const difficultyTagChecks =
        getDifficultyChecks(difficultyTags, onDifficultyTagCheckboxChange, false);
    const difficultyTagChecksSmall =
        getDifficultyChecks(difficultyTags, onDifficultyTagCheckboxChange, true);
    return [difficultyTagChecks, difficultyTagChecksSmall];
}

function getRecipeTypeChecks(
    recipeTypeTags: RecipeTypeTags[],
    onRecipeTypeTagCheckboxChange: (tag: RecipeTypeTags) => void,
    isSmall: boolean,
) {
    return Object.values(RecipeTypeTags).map((tag) =>
        <TagFilter
            key={`tag${isSmall ? '-sm' : ''}-${tag}`}
            inputClassName={`recipe-type-tag-checkbox${isSmall ? '-sm' : ''}`}
            inputId={`tag${isSmall ? '-sm' : ''}-${tag}`}
            onChange={() => onRecipeTypeTagCheckboxChange(tag)}
            isChecked={recipeTypeTags.includes(tag)}
            buttonText={RecipeTypeTagLabelsMap.get(tag) ?? ""}
        />
    );
}

function buildRecipeTypeTagChecks(
    recipeTypeTags: RecipeTypeTags[],
    onRecipeTypeTagCheckboxChange: (tag: RecipeTypeTags) => void,
) {
    const recipeTypeTagChecks =
        getRecipeTypeChecks(recipeTypeTags, onRecipeTypeTagCheckboxChange, false);
    const recipeTypeTagChecksSmall =
        getRecipeTypeChecks(recipeTypeTags, onRecipeTypeTagCheckboxChange, true);
    return [recipeTypeTagChecks, recipeTypeTagChecksSmall];
}

const TagFilter = ({
    inputClassName,
    inputId,
    onChange,
    isChecked,
    buttonText,
}: {
    inputClassName: string,
    inputId: string,
    onChange: () => void,
    isChecked: boolean,
    buttonText: string,
}) => {
    return (
        <li className={styles.tagFilter}>
            <input className={inputClassName} type="checkbox" onChange={onChange} id={inputId} checked={isChecked} />
            <div className={styles.tagFilterLabel}>
                {buttonText}
            </div>
        </li>
    );
}