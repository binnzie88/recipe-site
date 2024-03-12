import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Recipe } from './Recipe';
import { DietarySelections, RecipeEntry, Tag } from '../types';
import { navBackToTop, smoothScrollDown } from '../utils';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/Recipe.module.scss';
import classNames from 'classnames';

export const RecipePage = () => {
  const [recipe, setRecipe] = useState<RecipeEntry>();

  // Get recipe from the server
  const location = useLocation();
  const recipeId = location.pathname.split("/")[2];
  if (recipeId.length < 1) {
    // TODO: show better error page
    return (<div>{'Could not find recipe "' + recipeId + '", please try another recipe.'}</div>)
  }
  useEffect(() => {
    axios.get('http://localhost:9000/recipe/'+recipeId).then((response) => {
      console.log("IN THE CALL");
      console.log(response);
      if (response.data.error != null) {
        // TODO: show error page
        console.log("ERROR");
        console.log(response.data.error);
      } else {
        setRecipe(response.data.recipe[0] as RecipeEntry);
      }
    });
  }, []);

  if (recipe == null) {
    // TODO: show better loading page
    return (<div>Loading...</div>);
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
              <a onClick={(e) => smoothScrollDown(e, "#recipe")} className={sharedStyles.heroButton}>Get Started</a>
            </div>
          </section>
          <main>
            <section id="recipe" className={styles.recipe}>
              <Recipe title={title} ingredients={ingredients} steps={steps} notes={notes} image={image} substitutions={substitutions} tags={tags as Tag[]} />
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
