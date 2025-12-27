import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DietarySelectionButtonText } from '../consts';
import { DietarySelection, RecipeInfo } from '../types';
import { getIngredientOrStepElements, getIngredients, getNutritionInfoElements } from '../utils';
import { ComingSoonImage } from './ComingSoonImage';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/Recipe.module.scss';

export interface RecipeProps {
    recipe: RecipeInfo;
    imageUrl: string | undefined;
}

export const Recipe = ({ recipe, imageUrl }: RecipeProps) => {
    const { name, ingredients, steps, notes, nutritionInfo, numServings, dietaryOptions, tags } = recipe;
    const [dietarySelection, setDietarySelection] = useState(DietarySelection.Original);

    const image = useMemo(() => {
        return (
            imageUrl === undefined
                ? <ComingSoonImage className="img-fluid" />
                : <img src={imageUrl} alt={recipe.name} className="img-fluid" />
        );
    }, [imageUrl]);

    // Build maps for getting steps, ingredients, and nutrition info for the current dietary selection
    const ingredientsForDietarySelection = useMemo(() => {
        return getIngredientOrStepElements(
            ingredients,
            dietarySelection,
            false,
            'ing',
        );
    }, [ingredients, dietarySelection]);

    const stepsForDietarySelection = useMemo(() => {
        return getIngredientOrStepElements(
            steps,
            dietarySelection,
            true,
            'step',
        );
    }, [steps, dietarySelection]);

    const nutritionInfoForDietarySelection = useMemo(() => {
        return getNutritionInfoElements(
            nutritionInfo,
            dietarySelection,
        );
    }, [steps, dietarySelection]);

    // Build notes and tags for recipe
    const notesList = useMemo(() => {
        if (notes === undefined) {
            return null;
        }
        return notes.map((note, idx) => {
            return <p className={styles.notesEntry} key={idx}>{note}</p>;
        });
    }, [notes]);

    const tagsList = useMemo(() => {
        if (tags === undefined) {
            return null;
        }
        return tags.map((tag, idx) => {
            const maybeComma = idx < tags.length - 1 ? ",\xa0" : "";
            return (
                <li key={idx}>
                    <Link to={`../recipes?tag=${tag}`}>{tag}</Link>
                    {maybeComma}
                </li>
            );
        });
    }, [tags]);

    // Build buttons to switch dietary selection
    const dietarySelectionButtons = useMemo(() => {
        if (dietaryOptions === undefined || dietaryOptions.length === 0) {
            return null;
        }
        return [DietarySelection.Original, ...dietaryOptions].map((option) => {
            return (
                <button 
                    key={option}
                    className={classNames(option, { "selected": dietarySelection === option })}
                    onClick={() => setDietarySelection(option)}
                >
                    {DietarySelectionButtonText.get(option)}
                </button>
            );
        });
    }, [dietaryOptions, dietarySelection, setDietarySelection]);

    // Display recipe
    return (
        <div className={classNames(sharedStyles.topContainer, sharedStyles.expandOnSmallScreens)}>
            <article className={classNames(styles.entry, styles.entrySingle)}>
                <div className={styles.entryContent}>
                    <div className={classNames(styles.leftColumn, styles.noPrint)}>
                        {image}
                        <div className={styles.leftContent}>
                            <div className={classNames(styles.notes)}>
                                <h3>{"Notes"}</h3>
                                {notesList}
                            </div>
                            {nutritionInfoForDietarySelection}
                        </div>
                    </div>
                    <div className={styles.rightColumn}>
                        <div className={classNames(styles.mainColumnContent, styles.printable)} id="recipe-text">
                            <div className={styles.printButtons}>
                                <button title="Print Recipe" onClick={() => window.print()}>
                                    <i className="material-icons">print</i>
                                </button>
                                <button title="Copy Ingredients" onClick={getIngredients}>
                                    <i className="material-icons">list</i>
                                </button>
                            </div>
                            <h2>{name}</h2>
                            <div>
                                {dietarySelectionButtons}
                            </div>
                            <h3>{"Ingredients"}</h3>
                            <ul id="ingredient-list">
                                {ingredientsForDietarySelection}
                            </ul>
                            <h3>{"Steps"}</h3>
                            <ol>
                                {stepsForDietarySelection}
                            </ol>
                            <div className={styles.stackedLeftContent}>
                                <div className={classNames(styles.notes, styles.printable)}>
                                    <h3>{"Notes"}</h3>
                                    {notesList}
                                </div>
                                {nutritionInfoForDietarySelection}
                            </div>
                        </div>
                        <div className={classNames(sharedStyles.entryFooter, styles.recipeFooter)}>
                            <div className={sharedStyles.tagsContainer}>
                                <i className="material-icons">local_offer</i>
                                <ul className={sharedStyles.tags}>
                                    {tagsList}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
