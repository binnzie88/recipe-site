import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { DietarySelection, DietarySelectionButtonText, Tag } from '../types';
import { getDietarySelectionItems, getIngredients } from '../utils';
import '../styles/App.css';

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
      return (
        <li key={idx}>
          <a href={"../recipes?tag="+tag}>{tag}</a>
        </li>
      );
    });
  }, []);

  // Build buttons to switch dietary selection
  const dietarySelectionButtons = useMemo(() => {
    return [DietarySelection.Original, ...substitutions].map((substitution) => {
      return (
        <button 
          className={classNames(substitution, {"active": dietarySelection === substitution})}
          onClick={() => setDietarySelection(substitution)}
        >
          {DietarySelectionButtonText.get(substitution)}
        </button>
      );
    });
  }, [substitutions, dietarySelection, setDietarySelection]);

  // Display recipe
  return (
    <div className="top-container">
      <div className="row">
        <div className="col-xl-12">
          <article className="entry entry-single">
            <div className="entry-content">
              <div className="row">
                <div className="left-column col-12 col-md-5 no-print">
                  <img src={require("../img/"+image)} alt="" className="img-fluid" />
                  <div className="column-notes" id="recipe-notes">
                    <h4>Notes:</h4>
                    {notesList}
                  </div>
                  <div className="print-buttons">
                    <button title="Print Recipe" onClick={() => window.print()}>
                        <i className="material-icons">print</i>
                    </button>
                    <button title="Copy Ingredients" onClick={getIngredients}>
                        <i className="material-icons">list</i>
                    </button>
                  </div>
                </div>
                <div className="right-column col-12 col-md-7">
                  <div className="column-content printable" id="recipe-text">
                    <h2>{title}</h2>
                    <div className="substitutions">
                      {dietarySelectionButtons}
                    </div>
                    <h3>Ingredients</h3>
                    <div className="row printable" id="ingredient-list">
                      <div className="column col-12 printable">
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
                  <div className="column-notes print-only" id="notes">
                    <h3>Notes:</h3>
                    {notesList}
                  </div>
                  <div className="entry-footer">
                    <div className="float-left">
                      <i className="material-icons">local_offer</i>
                      <ul className="tags">
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
