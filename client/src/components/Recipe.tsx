import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DietarySelectionButtonText } from '../consts';
import { DietarySelection, RecipeInfo } from '../types';
import { getIngredientOrStepElements, getIngredients } from '../utils';
import { ComingSoonImage } from './ComingSoonImage';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/Recipe.module.scss';

export interface RecipeProps {
    recipe: RecipeInfo;
    imageUrl: string | undefined;
}

export const Recipe = ({ recipe, imageUrl }: RecipeProps) => {
    const { name, ingredients, steps, notes, dietaryOptions, tags } = recipe;
    const [dietarySelection, setDietarySelection] = useState(DietarySelection.Original);

    const image = useMemo(() => {
        return (
            imageUrl === undefined
                ? <ComingSoonImage className="img-fluid" />
                : <img src={imageUrl} alt={recipe.name} className="img-fluid" />
        );
    }, [imageUrl]);

    // Build maps for getting steps and ingredients for the current dietary selection
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

    // Build notes and tags for recipe
    const notesList = useMemo(() => {
        if (notes === undefined) {
            return null;
        }
        return notes.map((note, idx) => {
            return <p key={idx}>{note}</p>;
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
                    className={classNames(option, {"selected": dietarySelection === option})}
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
            <div className="row">
                <div className="col-xl-12">
                    <article className={classNames(styles.entry, styles.entrySingle)}>
                        <div className={styles.entryContent}>
                            <div className="row">
                                <div className={classNames("col-12", "col-md-5", styles.noPrint)}>
                                    {image}
                                    <div className={classNames("d-md-block", "d-sm-none", styles.notes)}>
                                        <h4>{"Notes:"}</h4>
                                        {notesList}
                                    </div>
                                </div>
                                <div className={classNames("col-12", "col-md-7")}>
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
                                        <div className={classNames("row", styles.printable)} id="ingredient-list">
                                            <div className={classNames("column", "col-12", styles.printable)}>
                                                <ul>
                                                    {ingredientsForDietarySelection}
                                                </ul>
                                            </div>
                                        </div>
                                        <h3>{"Steps"}</h3>
                                        <ol>
                                            {stepsForDietarySelection}
                                        </ol>
                                    </div>
                                    <div className={styles.printOnly}>
                                        <h3>{"Notes:"}</h3>
                                        {notesList}
                                    </div>
                                    <div className={classNames("d-md-none", styles.notes, styles.stackedNotes)}>
                                        <h3>{"Notes:"}</h3>
                                        {notesList}
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
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}
