import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CategoryTags, DietaryTags, DifficultyTags, TagButtonText, DietaryFilterTags } from '../consts';
import { FormattedRecipeSuggestion, NestedSuggestionInput, Tag } from '../types';
import {
  addInput,
  addInputSubstitution,
  copyRecipe,
  deleteInput,
  deleteInputSubstitution,
  getFormattedSuggestionInputs,
  updateInput,
  updateInputSubstitution
} from '../utils';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/RecipeSuggestionPage.module.scss';

export const RecipeSuggestionPage = () => {
  const [ingredients, setIngredients] = useState<NestedSuggestionInput[]>(
    [{ inputText: "", substitutions: new Map<Tag, string>(), subInputs:[] }]
  );
  const [steps, setSteps] = useState<NestedSuggestionInput[]>(
    [{ inputText: "", substitutions: new Map<Tag, string>(), subInputs:[] }]
  );
  const [notes, setNotes] = useState<NestedSuggestionInput[]>(
    [{ inputText: "", substitutions: new Map<Tag, string>(), subInputs:[] }]
  );
  const [recipeString, setRecipeString] = useState<string>("");
  const [formattedRecipe, setFormattedRecipe] = useState<FormattedRecipeSuggestion>({
    id: "",
    title: "",
    subtitle: "",
    time: "",
    imageUrl: "",
    formattedIngredients: "",
    formattedSteps: "",
    formattedNotes: "",
    formattedTags: "",
  })

  const showOverlay = useCallback(() => {
    const submitOverlay = document.getElementById("submit-overlay");
    if (submitOverlay != null) {
      submitOverlay.style.display = "flex";
    }
  }, []);
  const hideOverlay = useCallback(() => {
    const submitOverlay = document.getElementById("submit-overlay");
    if (submitOverlay != null) {
      submitOverlay.style.display = "none";
    }
  }, []);

  const submitRecipe = useCallback(() => {
    const {
      id,
      title,
      subtitle,
      time,
      imageUrl,
      formattedIngredients,
      formattedSteps,
      formattedNotes,
      formattedTags
    } = getFormattedSuggestionInputs(ingredients, steps, notes);

    const newRecipeString = 
      "INSERT INTO `recipes`.`RecipeTable` "
      +"(`id`, `title`, `subtitle`, `time`, `image`, `ingredients`, `steps`, `notes`, `tags`)"
      + `\nVALUES (`
      + `\n  ` + id
      + `\n  ` + title
      + `\n  ` + subtitle
      + `\n  ` + time
      + `\n  ` + imageUrl
      + `\n  ` + formattedIngredients
      + `\n  ` + formattedSteps
      + `\n  ` + formattedNotes
      + `\n\  ` + formattedTags
      + `\n` + ");";
    setRecipeString(newRecipeString);
    setFormattedRecipe(
      { id, title, subtitle, time, imageUrl, formattedIngredients, formattedSteps, formattedNotes, formattedTags }
    );
    showOverlay();
  }, [ingredients, steps, notes, setRecipeString, recipeString, setFormattedRecipe, formattedRecipe]);

  const ingredientElements = useMemo(() => {
    return buildNestedInputElements(ingredients, setIngredients, "Ingredients:", "Add Sub-Ingredient");
  }, [ingredients, setIngredients]);

  const stepElements = useMemo(() => {
    return buildNestedInputElements(steps, setSteps, "Steps:", "Add Sub-Step", true);
  }, [steps, setSteps]);

  const noteElements = useMemo(() => {
    return notes.map(({ inputText }, idx) => {
      return (
        <div key={idx} className={styles.topItemContainer}>
          <button className={styles.deleteButton} onClick={() => deleteInput(notes, setNotes, idx)}>
            <i className={classNames("material-icons", styles.buttonIcon)}>close</i>
          </button>
          <textarea
            rows={5}
            cols={30}
            value={inputText}
            onChange={(element) => updateInput(notes, setNotes, element, idx)}
          />
        </div>
      );
    });
  }, [notes, setNotes, updateInput, deleteInput,]);

  const submitOverlay = buildSubmitOverlay(formattedRecipe, recipeString, hideOverlay);
  
  return (
    <div className={styles.inputPageTop}>
      <Header isScrollable={false} />
      <main className={classNames(sharedStyles.pageContainer, styles.inputPageContainer)}>
        {submitOverlay}
        <div className={styles.inputPageBackground}>
          <section className={styles.suggestionSection}>
            <div className={classNames(styles.suggestionContainer, "container")}>
              <div className="row">
                <div className="col-12">
                  <div className={styles.recipeFormContainer}>
                    <h3>{"Suggest a Recipe"}</h3>
                    <p>
                      {"Thank you for your interest in suggesting a recipe! Please fill out the form below to suggest "}
                      {"a new recipe. The recipes in the Recipes list are curated recipes I personally stand by. "}
                      {"To keep that true, I will test out any suggested recipes, and if it is something I love and "}
                      {"will make again, I'll add it to the Recipes list (and credit you, of course)! Otherwise, I "}
                      {"will hold onto it to add to an upcoming Community Recipes section of the website."}<br/><br/>
                      {"Clicking the Submit button will open a prompt to copy a formatted representation of your "}
                      {"submission. Please copy that text and send it as-is to ebinns88@gmail.com. If you want to "}
                      {"include a specific image for your recipe, please add it as an attachment to the email you "}
                      {"send. Otherwise I'll try the recipe out as soon as I can and take a photo myself!"}
                    </p>
                    <div className="row">
                      <div className="col-12">
                        <div className={styles.inputContainer}>
                          <div className="row">
                            <div className="col-12">
                              <div className={styles.inputSection}>
                                {"Title:"}
                                <input type="text" id="title"/>
                              </div>
                              <div className={styles.inputSection}>
                                {"Subtitle:"}
                                <input type="text" id="subtitle"/>
                              </div>
                              <div className={styles.inputSection} id="ingredients">
                                {ingredientElements}
                              </div>
                              <div className={styles.inputSection} id="steps">
                                {stepElements}
                              </div>
                            </div>
                          </div><br/>
                          <div className="row">
                            <div className="col-12 col-md-6">
                              <div className={styles.inputSection}>
                                {"Time:"}
                                <input type="text" id="time"/>
                              </div>
                              <div className={styles.inputSection}>
                                {"Recipe Id (use dashes, no spaces):"}
                                <input type="text" id="recipeId"/>
                              </div>
                              <div className={styles.inputSection}>
                                {"Image Url:"}
                                <input type="text" id="imageUrl"/>
                              </div>
                              <div className={styles.inputSection}>
                                <div className={styles.sectionTitleWithButton}>
                                  {"Notes:"}
                                  <button className={styles.addButton} onClick={() => addInput(notes, setNotes)}>
                                    <i className={classNames("material-icons", styles.buttonIcon)}>add</i>
                                  </button>
                                </div>
                                <div className={"note-inputs"}>
                                  {noteElements}
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-md-6">
                              {"Tags:"}
                              <div className="row">
                                <div className="col-12">
                                  {[...DietaryTags, ...DifficultyTags, ...CategoryTags].map((tag) => {
                                    return (
                                      <div key={tag} className={styles.tagCheckContainer}>
                                        <input type="checkbox" className={"tag"} value={tag}/>
                                        <label>{TagButtonText.get(tag) ?? ""}</label>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={classNames(styles.suggestionButtonGroup, "float-right")}>
                          <button onClick={() => location.reload()}>Clear Entry</button>
                          <button className={styles.submitButton} onClick={submitRecipe}>Submit</button>
                        </div>
                      </div>
                    </div>
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

function buildSubmitOverlay(formattedRecipe: FormattedRecipeSuggestion, recipeString: string, hideOverlay: () => void) {
  return (
    <div className={styles.submitOverlay} id={"submit-overlay"}>
      <div className={styles.submitOverlayContent}>
        <div>
          <h4>{"Thank you for your submission!"}</h4>
          <p>{"Please copy the text below and send it to ebinns88@gmail.com."}</p>
        </div>
        <div className={styles.overlayTextArea}>
          <div>
            {"INSERT INTO `recipes`.`RecipeTable` "}
            {"(`id`, `title`, `subtitle`, `time`, `image`, `ingredients`, `steps`, `notes`, `tags`)"}
          </div>
          <div>{"VALUES ("}</div>
          <div className={styles.recipeField}>{'\xa0\xa0'+formattedRecipe.id}</div>
          <div className={styles.recipeField}>{'\xa0\xa0'+formattedRecipe.title}</div>
          <div className={styles.recipeField}>{'\xa0\xa0'+formattedRecipe.subtitle}</div>
          <div className={styles.recipeField}>{'\xa0\xa0'+formattedRecipe.time}</div>
          <div className={styles.recipeField}>{'\xa0\xa0'+formattedRecipe.imageUrl}</div>
          <div className={styles.recipeField}>{'\xa0\xa0'+formattedRecipe.formattedIngredients}</div>
          <div className={styles.recipeField}>{'\xa0\xa0'+formattedRecipe.formattedSteps}</div>
          <div className={styles.recipeField}>{'\xa0\xa0'+formattedRecipe.formattedNotes}</div>
          <div className={styles.recipeField}>{'\xa0\xa0'+formattedRecipe.formattedTags}</div>
          <div>{");"}</div>
        </div>
        <div className={styles.overlayButtonGroup}>
          <button className={styles.copyButton} onClick={() => copyRecipe(recipeString)}>
            {"Copy Recipe Text"}
          </button>
          <button className={styles.closeButton} onClick={hideOverlay}>{"Close"}</button>
        </div>
      </div>
    </div>
  );
}

function buildSubstitutionDropdown(
  inputs: NestedSuggestionInput[],
  setInputs: React.Dispatch<React.SetStateAction<NestedSuggestionInput[]>>,
  unsetSubstitutions: Tag[],
  inputIdx: number,
  parentInputIdx?: number
) {
  return (
    <div className="dropdown">
      <button 
        className={classNames(styles.addSubItemButton, "btn", "btn-secondary", "dropdown-toggle")}
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {"Add Substitution"}
      </button>
      <div 
        className={classNames(styles.substitutionDropdownMenu, "dropdown-menu")}
        aria-labelledby="dropdownMenuButton"
      >
        {unsetSubstitutions.map((diet, idx) => {
          return (
            <button
              key={idx}
              className={classNames("dropdown-item", styles.addSubstitutionButton)}
              onClick={() => addInputSubstitution(inputs, setInputs, diet, inputIdx, parentInputIdx)}
            >
              {TagButtonText.get(diet) ?? "Unknown"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function buildSubstitutionElementsForInput(
  inputs: NestedSuggestionInput[],
  setInputs: React.Dispatch<React.SetStateAction<NestedSuggestionInput[]>>,
  substitutions: Map<Tag, string>,
  subIdx: number,
  idx?: number,
) {
  const substitutionElements: JSX.Element[] = [];
  substitutions.forEach((substitutionValue, diet) => {
    substitutionElements.push(
      <div key={diet} className={styles.substitutionContainer}>
        <button
          className={styles.deleteButton}
          onClick={() => deleteInputSubstitution(inputs, setInputs, diet, subIdx, idx)}
        >
          <i className={classNames("material-icons", styles.buttonIcon)}>close</i>
        </button>
        <p>{TagButtonText.get(diet)+":" ?? "Unknown:"}</p>
        <input
          type="text"
          value={substitutionValue}
          onChange={(element) => updateInputSubstitution(inputs, setInputs, diet, element, subIdx, idx)}
        />
      </div>
    )
  });
  return substitutionElements;
}

function buildNestedInputElements(
  inputs: NestedSuggestionInput[],
  setInputs: React.Dispatch<React.SetStateAction<NestedSuggestionInput[]>>,
  headerTitle: string,
  subInputButtonText: string,
  useTextArea?: boolean,
) {
  const inputElements = inputs.map(({ inputText, substitutions, subInputs }, idx) => {
    const unsetSubstitutions = DietaryFilterTags.filter((diet) => !substitutions.has(diet));
    const substitutionDropdown = buildSubstitutionDropdown(inputs, setInputs, unsetSubstitutions, idx);

    const parentInput = useTextArea ? (
      <textarea
        value={inputText}
        onChange={(element) => updateInput(inputs, setInputs, element, idx)}
      />
    ) : (
      <input
        type="text"
        value={inputText}
        onChange={(element) => updateInput(inputs, setInputs, element, idx)}
      />
    );
    const parentInputElement = (
      <div className={styles.topItemContainer}>
        <button className={styles.deleteButton} onClick={() => deleteInput(inputs, setInputs, idx)}>
          <i className={classNames("material-icons", styles.buttonIcon)}>close</i>
        </button>
        {parentInput}
        <button className={styles.addSubItemButton} onClick={() => addInput(inputs, setInputs, idx)}>
          {subInputButtonText}
        </button>
        {unsetSubstitutions.length > 0 ? substitutionDropdown : null}
      </div>
    );

    const parentSubstitutionElements = buildSubstitutionElementsForInput(inputs, setInputs, substitutions, idx);
    const subInputElements = subInputs.map(({ subInputText, substitutions: subSubstitutions }, subIdx) => {
      const subUnsetSubstitutions = DietaryFilterTags.filter((diet) => !subSubstitutions.has(diet));
      const subSubstitutionDropdown = buildSubstitutionDropdown(inputs, setInputs, subUnsetSubstitutions, subIdx, idx);
      const subInputField = useTextArea ? (
        <textarea
          className={styles.stepInput}
          value={subInputText}
          onChange={(element) => updateInput(inputs, setInputs, element, subIdx, idx)}
        />
      ) : (
        <input
          type="text"
          value={subInputText}
          onChange={(element) => updateInput(inputs, setInputs, element, subIdx, idx)}
        />
      );
      const subSubstitutionElements = buildSubstitutionElementsForInput(
        inputs, setInputs, subSubstitutions, subIdx, idx);
      return (
        <div key={subIdx} className={styles.subItemContainer}>
          <div className={styles.subItem}>
            <button className={styles.deleteButton} onClick={() => deleteInput(inputs, setInputs, subIdx, idx)}>
              <i className={classNames("material-icons", styles.buttonIcon)}>close</i>
            </button>
            {subInputField}
            {subUnsetSubstitutions.length > 0 ? subSubstitutionDropdown : null}
          </div>
          {subSubstitutionElements}
        </div>
      )
    });
    return (
      <div key={idx}>
        {parentInputElement}
        {parentSubstitutionElements}
        {subInputElements}
      </div>
    );
  });

  return (
    <React.Fragment>
      <div className={styles.sectionTitleWithButton}>
        {headerTitle}
        <button className={styles.addButton} onClick={() => addInput(inputs, setInputs)}>
          <i className={classNames("material-icons", styles.buttonIcon)}>add</i>
        </button>
      </div>
      {inputElements}
    </React.Fragment>
  )
}
