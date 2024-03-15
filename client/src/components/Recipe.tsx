import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { DietarySelection, Tag } from '../types';
import { getDietarySelectionItems, getIngredients } from '../utils';
import styles from '../styles/Recipe.module.scss';
import sharedStyles from '../styles/CommonStyles.module.scss';
import { DietarySelectionButtonText } from '../consts';

export interface RecipeProps {
  title: string;
  ingredients: string[][];
  steps: string[][];
  notes: string[];
  image: string;
  substitutions: DietarySelection[];
  tags: Tag[];
}

export const Recipe = ({ title, ingredients, steps, notes, image, substitutions, tags }: RecipeProps) => {
  const [dietarySelection, setDietarySelection] = useState(DietarySelection.Original);

  // Build maps for getting steps and ingredients for the current dietary selection
  const ingredientsByDietarySelection = useMemo(() => {
    return getDietarySelectionItems(ingredients, substitutions, false);
  }, [ingredients, substitutions]);
  const stepsByDietarySelection = useMemo(() => {
    return getDietarySelectionItems(steps, substitutions, true);
  }, [steps, substitutions]);

  // Determine which ingredients and steps to show for current dietary selection
  const ingredientsList = useMemo(() => {
    return ingredientsByDietarySelection.get(dietarySelection);
  }, [dietarySelection, ingredientsByDietarySelection]);
  const stepsList = useMemo(() => {
    return stepsByDietarySelection.get(dietarySelection);
  }, [dietarySelection, stepsByDietarySelection]);

  // Build notes and tags for recipe
  const notesList = useMemo(() => {
    return notes.map((note, idx) => {
      return <p key={idx}>{note}</p>;
    });
  }, [notes]);
  const tagsList = useMemo(() => {
    return tags.map((tag, idx) => {
      const maybeComma = idx < tags.length - 1 ? ",\xa0" : "";
      return (
        <li key={idx}>
          <a href={"../recipes?tag="+tag}>{tag}</a>
          {maybeComma}
        </li>
      );
    });
  }, []);

  // Build buttons to switch dietary selection
  const dietarySelectionButtons = useMemo(() => {
    return [DietarySelection.Original, ...substitutions].map((substitution) => {
      return (
        <button 
          className={classNames(substitution, {"selected": dietarySelection === substitution})}
          onClick={() => setDietarySelection(substitution)}
        >
          {DietarySelectionButtonText.get(substitution)}
        </button>
      );
    });
  }, [substitutions, dietarySelection, setDietarySelection]);

  // Display recipe
  return (
    <div className={classNames(sharedStyles.topContainer, sharedStyles.expandOnSmallScreens)}>
      <div className="row">
        <div className="col-xl-12">
          <article className={classNames(styles.entry, styles.entrySingle)}>
            <div className={styles.entryContent}>
              <div className="row">
                <div className={classNames("col-12", "col-md-5", styles.noPrint)}>
                  <img src={require("../img/"+image)} alt="" className="img-fluid" />
                  <div className={styles.notes}>
                    <h4>Notes:</h4>
                    {notesList}
                  </div>
                  <div className={styles.printButtons}>
                    <button title="Print Recipe" onClick={() => window.print()}>
                        <i className="material-icons">print</i>
                    </button>
                    <button title="Copy Ingredients" onClick={getIngredients}>
                        <i className="material-icons">list</i>
                    </button>
                  </div>
                </div>
                <div className={classNames("col-12", "col-md-7")}>
                  <div className={classNames(styles.mainColumnContent, styles.printable)} id="recipe-text">
                    <h2>{title}</h2>
                    <div>
                      {dietarySelectionButtons}
                    </div>
                    <h3>Ingredients</h3>
                    <div className={classNames("row", styles.printable)} id="ingredient-list">
                      <div className={classNames("column", "col-12", styles.printable)}>
                        <ul>
                          {ingredientsList}
                        </ul>
                      </div>
                    </div>
                      <h3>Steps</h3>
                      <ol>
                        {stepsList}
                      </ol>
                  </div>
                  <div className={styles.printOnly}>
                    <h3>Notes:</h3>
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
