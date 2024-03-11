import '../styles/App.css';
import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Header } from './Header';
import { Footer } from './Footer';

export const RecipeInputPage = () => {

  /**
   * TODO:
   * - Get addIngredient and addStep working
   * - Actually get sub-ingredients and sub-steps working
   * - Reformat tags/folders to match search page/new format
   * - Figure out a better way to represent substitutions
   * - Clean up styling/code
   */

  const [ingredientCount, setIngredientCount] = useState<number>(0);

  const addIngredient = useCallback(() => {
    const ingredientId = "ingredient-"+ingredientCount;
    const newIngredient = (
      <div className="ingredientItem" id={ingredientId}>  
        <input type="text" name="ingredient" />
          <button className="delete-button">
            Delete
          </button>
          <button className="sub-ingredient-button" onClick={() => addSubIngredient(ingredientId)}>
            Add sub-ingredient
          </button>
      </div>
    );
    // $("#ingredient").append(newIngredient);
    setIngredientCount(ingredientCount + 1);
  }, [ingredientCount, setIngredientCount]);

  const addSubIngredient = useCallback((parentElementId: string) => {
    const parentIngredient = document.getElementById(parentElementId);
    if (parentIngredient != null) {
      const ingredientId = "ingredient-"+ingredientCount;
      const newSubIngredient = (
        <div className="subIngredientItem" id={ingredientId}>
          <input type="text" name="ingredient" />
            <button className="delete-button">
              Delete
            </button>
        </div>
      );
      //parentIngredient.append()
      setIngredientCount(ingredientCount + 1);
    }
  }, [ingredientCount, setIngredientCount]);

  const addStep = useCallback(() => {
    // TODO: add step
  }, []);

  const addSubStep = useCallback((parentElementId: string) => {
    // TODO: add substep
    console.log(parentElementId);
  }, []);

  const sendEmail = useCallback(() => {
    // TODO: form and send email
  }, []);
  
  return (
    <React.Fragment>
      <Header />
      <main id="main">
        <section id="suggestion" className="suggestion">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h3>Suggest a Recipe</h3>
                <div className="recipe-form-container">
                  <p>
                    Thank you for your interest in suggesting a recipe! Please fill out the form below to suggest a new recipe. 
                    The recipes in the Recipes list are curated recipes I personally stand by. To keep that true, I will test out any suggested recipes, and if it is something I love and will make again, I'll add it to the Recipes list (and credit you, of course)! Otherwise, I will hold onto it to add to an upcoming Community Recipes section of the website.<br/><br/>
                    Clicking the Submit button will open an email draft to me with your recipe pre-formatted, so please do not edit the email text before sending. 
                    If you want to include a specific image for your recipe, please add it as an attachment to the email before sending. Otherwise I'll try the recipe out as soon as I can and take a photo myself!
                  </p>
                  <div className="row">
                    <div className="col-12">
                      <div className="recipe-form">
                        <div className="row">
                          <div className="col-12">
                            Title:<br/>
                            <input type="text" id="title"/><br/>
                            Subtitle:<br/>
                            <input type="text" id="subtitle"/><br/>
                            Ingredients:<br/>
                            <div className="input-group" id="ingredients">
                              <input type="text" name="ingredients" /><br/>
                              <button className="add-button" onClick={addIngredient}>Add</button>
                            </div>
                            Steps:<br/>
                            <div className="input-group" id="steps">
                              <textarea name="steps"></textarea><br/><br/>
                              <button className="add-button" onClick={addStep}>Add</button>
                            </div>
                          </div>
                        </div><br/>
                        <div className="row">
                          <div className="col-12 col-md-6">
                            Time:<br/>
                            <input type="text" id="time"/><br/>
                            Notes:<br/>
                            <textarea id="notes" name="notes" rows={5} cols={30}></textarea><br/>
                            Substitutions:<br/>
                            <textarea id="subs" name="subs" rows={5} cols={30}></textarea><br/>
                          </div>
                          <div className="col-12 col-md-6">
                            Folder:<br/>
                            <select id="fldr-select" className="folder-dropdown">
                              <option value="breakfast">Breakfast</option>
                              <option value="lunch">Lunch</option>
                              <option value="dinner">Dinner</option>
                              <option value="snacks">Snacks</option>
                              <option value="dessert">Dessert</option>
                              <option value="breads">Breads</option>
                              <option value="drinks">Drinks</option>
                            </select><br/>
                            Tags:<br/>
                            <div className="row">
                              <div className="col-12">
                                <input type="checkbox" id="tag1" name="tags" value="vegetarian"/>
                                <label> Vegetarian</label><br/>
                                <input type="checkbox" id="tag2" name="tags" value="vegan"/>
                                <label> Vegan</label><br/>
                                <input type="checkbox" id="tag3" name="tags" value="gluten-free"/>
                                <label> Gluten-Free</label><br/>
                                <input type="checkbox" id="tag4" name="tags" value="vegetarian-sub"/>
                                <label> Vegetarian Substitute Provided</label><br/>
                                <input type="checkbox" id="tag5" name="tags" value="vegan-sub"/>
                                <label> Vegan Substitute Provided</label><br/>
                                <input type="checkbox" id="tag6" name="tags" value="gluten-free-sub"/>
                                <label> Gluten-Free Substitute Provided</label><br/>
                                <input type="checkbox" id="tag7" name="tags" value="easy"/>
                                <label> Easy</label><br/>
                                <input type="checkbox" id="tag8" name="tags" value="intermediate"/>
                                <label> Intermediate</label><br/>
                                <input type="checkbox" id="tag9" name="tags" value="difficult"/>
                                <label> Difficult</label><br/>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="float-right">
                          <button className="submit-button" onClick={sendEmail}>Submit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </React.Fragment>
  );
}
