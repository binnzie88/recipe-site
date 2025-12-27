import classNames from 'classnames';
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
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
    const [areFiltersExpanded, setAreFiltersExpanded] = useState(false);

    const toggleFiltersSection = useCallback(() => {
        setAreFiltersExpanded((prev) => !prev);
    }, [setAreFiltersExpanded]);

    const filterButtonIcon = useMemo(() => {
        return areFiltersExpanded ? `keyboard_arrow_up` : `keyboard_arrow_down`;
    }, [areFiltersExpanded]);

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

    // Build filter checkboxes
    const dietarySection = useMemo(() => buildChecksSection({
        sectionTitle: `Diet`,
        tooltipText: `Search results will only include recipes that match (or provide substitutions for) all selected dietary restrictions.`,
        tagOptions: Object.values(DietarySelection).filter((tag) => tag !== DietarySelection.Original),
        selectedTags: selectedDietaryTags,
        onTagCheckboxChange: onDietaryTagCheckboxChange,
        inputClassName: `dietary-tag-checkbox`,
        buttonTextLabelsMap: DietarySelectionLabelsMap,
    }), [selectedDietaryTags, onDietaryTagCheckboxChange]);

    const difficultySection = useMemo(() => buildChecksSection({
        sectionTitle: `Difficulty`,
        tooltipText: `Search results will include recipes that match any selected difficulty levels.`,
        tagOptions: Object.values(DifficultyTags),
        selectedTags: selectedDifficultyTags,
        onTagCheckboxChange: onDifficultyTagCheckboxChange,
        inputClassName: `difficulty-tag-checkbox`,
        buttonTextLabelsMap: DifficultyTagLabelsMap,
    }), [selectedDifficultyTags, onDifficultyTagCheckboxChange]);

    const recipeTypeSection = useMemo(() => buildChecksSection({
        sectionTitle: `Other`,
        tooltipText: `Search results will include recipes that match any selected tags in this category.`,
        tagOptions: Object.values(RecipeTypeTags),
        selectedTags: selectedRecipeTypeTags,
        onTagCheckboxChange: onRecipeTypeTagCheckboxChange,
        inputClassName: `recipe-type-tag-checkbox`,
        buttonTextLabelsMap: RecipeTypeTagLabelsMap,
    }), [selectedRecipeTypeTags, onRecipeTypeTagCheckboxChange]);

    return (
        <div className={styles.sidebarSection} key={`search-filters-container`}>
            <div className={styles.sidebar}>
                <div className={styles.searchContainer}>
                    <h3 className={styles.sidebarTitle}>{"Search"}</h3>
                    <div className={styles.searchForm}>
                        <input type="text" id="searchInput" onKeyUp={updateSearchTermCallback}/>
                        <button type="submit" onClick={updateSearchTermCallback}><i className="material-icons">search</i></button>
                    </div>
                    <button
                        className={classNames(styles.filterButton, "btn", "btn-primary")}
                        onClick={toggleFiltersSection}
                    >
                        {"Filters"}
                        <i className={classNames("material-icons", styles.filterButtonIcon)}>{filterButtonIcon}</i>
                    </button>
                </div>
                <div className={classNames(styles.shownLg, styles.collapsibleFilters, { [styles.expanded]: areFiltersExpanded })}>
                    <h2 className={classNames(styles.sidebarTitle, styles.filtersSectionLabel)}>{"Filters"}</h2>
                    {dietarySection}
                    {difficultySection}
                    {recipeTypeSection}
                </div>
                <div className={classNames(styles.hiddenLg, styles.collapsibleFilters, { [styles.expanded]: areFiltersExpanded })}>
                    <div className={styles.expandedFiltersContainer}>
                        <h2 className={classNames(styles.sidebarTitle, styles.filtersSectionLabel)}>{"Filters"}</h2>
                        {dietarySection}
                        {difficultySection}
                        {recipeTypeSection}
                    </div>
                </div>
            </div>
        </div>
    );
}

function buildChecksSection<T extends DietarySelection | DifficultyTags | RecipeTypeTags>({
    sectionTitle,
    tooltipText,
    tagOptions,
    selectedTags,
    onTagCheckboxChange,
    inputClassName,
    buttonTextLabelsMap,
} : {
    sectionTitle: string;
    tooltipText: string;
    tagOptions: T[];
    selectedTags: T[];
    onTagCheckboxChange: (tag: T) => void;
    inputClassName: string;
    buttonTextLabelsMap: Map<T, string>;
}) {
    return (
        <div className={styles.filtersSection}>
            <div className={classNames(styles.filterHeaderRow)}>
                <h2 className={styles.sidebarSubtitle}>{sectionTitle}</h2>
                <div className={styles.tooltipAnchor}>
                    <i className={classNames(styles.infoIcon, "material-icons")}>info</i>
                    <span className={styles.tooltipText}>
                        {tooltipText}
                    </span>
                </div>
            </div>
            <ul className={styles.tagCheckboxes}>
                {tagOptions.map((tag) => (
                    <li className={styles.tagFilter} key={`tag-${tag}`}>
                        <input
                            className={inputClassName}
                            type="checkbox"
                            onChange={() => onTagCheckboxChange(tag)}
                            id={`tag-${tag}`}
                            checked={selectedTags.includes(tag)}
                        />
                        <div className={styles.tagFilterLabel}>
                            {buttonTextLabelsMap.get(tag) ?? ""}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
