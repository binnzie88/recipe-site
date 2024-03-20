import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Recipe } from './Recipe';
import { RecipeErrorPage } from './RecipeErrorPage';
import { DietarySelections, LoadingRecipe } from '../consts';
import { RecipeEntry, Tag } from '../types';
import { navBackToTop, smoothScrollDown } from '../utils';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/Recipe.module.scss';

export const RecipePage = () => {
  const [recipe, setRecipe] = useState<RecipeEntry | undefined>(LoadingRecipe);
  const [recipeError, setRecipeError] = useState<JSX.Element>(
    <h2>{"We could not load the recipe, please try again later."}</h2>
  );

  // Get recipe from the server
  const location = useLocation();
  const recipeId = location.pathname.split("/")[2] ?? "";
  if (recipeId.length < 1) {
    return (
      <RecipeErrorPage errorContent={<h2>{"Select a recipe "}<a href="../recipes/">{"here"}</a></h2>} />
    );
  }
  
  useEffect(() => {
    axios.get('https://www.justabunchofrecipes.com/api/recipe/'+recipeId).then((response) => {
      if (response.data.error != null) {
        console.log("Error received from database:");
        console.log(response.data.error);
        setRecipeError(<h2>{"We are experiencing technical difficulties. Please try again later."}</h2>);
        setRecipe(undefined);
      } else if (response.data.recipe.length == 0) {
        setRecipeError(<h2>{"We could not find a "+recipeId+" recipe, please try a different recipe."}</h2>);
        setRecipe(undefined);
      } else {
        setRecipe(response.data.recipe[0] as RecipeEntry);
      }
    }).catch((e) => {
      console.log("Error connecting to database:");
      console.log(e);
      setRecipeError(<h2>{"We could not load the "+recipeId+" recipe, please try again later."}</h2>);
      setRecipe(undefined);
    });
  }, [recipeId]);

  if (recipe == null) {
    return (<RecipeErrorPage errorContent={recipeError} />);
  } else {
    const {title, subtitle, time, image, ingredients, steps, notes, tags} = recipe;
    const substitutions = DietarySelections.filter((tag) => tags.includes(tag));

    // Display recipe page
    return (
      <React.Fragment>
        <Header isScrollable={true} />
        <div className={classNames(sharedStyles.pageContainer)} id="scroll-top-container">
          <section className={classNames(sharedStyles.hero, styles.noPrint)}>
            <div className={sharedStyles.heroContainer}>
              <h3>
                Time Required: <strong>{time}</strong>
              </h3>
              <h1>{title}</h1>
              <h2>{subtitle}</h2>
              <a onClick={(e) => smoothScrollDown(e, "#recipe")} className={sharedStyles.heroButton}>{"Get Started"}</a>
            </div>
          </section>
          <main>
            <section id="recipe" className={styles.recipe}>
              <Recipe
                title={title}
                ingredients={ingredients}
                steps={steps}
                notes={notes}
                image={image}
                substitutions={substitutions}
                tags={tags as Tag[]}
              />
            </section>
          </main>
        </div>
        <Footer />
        <a href="#" className={classNames("back-to-top", styles.noPrint)} onClick={navBackToTop}>
          <i className="material-icons">keyboard_arrow_up</i>
        </a>
      </React.Fragment>
    );
  }
}
