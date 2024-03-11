import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Recipe } from './Recipe';
import { DietarySelections, RecipeEntry, Tag } from '../types';
import { navBackToTop, navToRecipe } from '../utils';
import '../styles/App.css';
//import styles from '../styles/RecipePage.module.css';

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
        <Header />
        <div className="page-container" id="recipe-container">
          <section className="no-print" id="hero">
            <div className="hero-container">
              <h3>
                Time Required: <strong>{time}</strong>
              </h3>
              <h1>{title}</h1>
              <h2>{subtitle}</h2>
              <a href="#recipe" onClick={(e) => navToRecipe(e)} className="btn-get-started scrollto">Get Started</a>
            </div>
          </section>
          <main id="main">
            <section id="recipe" className="recipe">
              <Recipe title={title} ingredients={ingredients} steps={steps} notes={notes} image={image} substitutions={substitutions} tags={tags as Tag[]} />
            </section>
          </main>
        </div>
        <Footer />
        <a href="#" id="back-to-top" className="back-to-top no-print" onClick={navBackToTop}>
          <i className="material-icons">keyboard_arrow_up</i>
        </a>
      </React.Fragment>
    );
  }
}
