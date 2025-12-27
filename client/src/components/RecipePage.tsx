import classNames from 'classnames';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LoadingRecipe } from '../consts';
import { RecipeInfo, RecipesAndIngredientsContext } from '../types';
import { getImageUrl, navBackToTop, smoothScrollDown } from '../utils';
import { Header } from './Header';
import { Footer } from './Footer';
import { Recipe } from './Recipe';
import { RecipeErrorPage } from './RecipeErrorPage';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/Recipe.module.scss';

export const RecipePage = () => {
    const [recipe, setRecipe] = useState<RecipeInfo | undefined>(LoadingRecipe);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const { appStorage, recipes } = useContext(RecipesAndIngredientsContext);

    const recipeError = useMemo(() => {
        return (<h2>{"We could not load the recipe, please try again later."}</h2>);
    }, []);

    const location = useLocation();
    const recipeId = location.pathname.split("/")[2] ?? "";
    if (recipeId === '') {
        return (
            <RecipeErrorPage errorContent={<h2>{"Select a recipe "}<Link to={`../recipes/`}>{"here"}</Link></h2>} />
        );
    }

    useEffect(() => {
        if (recipes !== undefined && recipes.length > 0) {
            const currentRecipe = recipes.find((r) => r.id === recipeId);
            setRecipe(currentRecipe);
            if (appStorage !== undefined) {
                getImageUrl(appStorage, currentRecipe, setImageUrl);
            }
        }
    }, [recipes, recipeId, setRecipe, appStorage, setImageUrl]);

    if (recipe === undefined) {
        return (<RecipeErrorPage errorContent={recipeError} />);
    } else {
        const {name, description, time} = recipe;

        // Display recipe page
        return (
            <React.Fragment>
                <Header isScrollable={true} />
                <div className={classNames(sharedStyles.pageContainer)} id="scroll-top-container">
                    <section className={classNames(sharedStyles.hero, styles.noPrint)}>
                        <div className={classNames(sharedStyles.heroContainer, styles.summaryContainer)}>
                            <h3>
                                Time Required: <strong>{time}</strong>
                            </h3>
                            <h1>{name}</h1>
                            <h2>{description}</h2>
                            <a onClick={(e) => smoothScrollDown(e, "#recipe")} className={sharedStyles.heroButton}>
                                {"Get Started"}
                            </a>
                        </div>
                    </section>
                    <main>
                        <section id="recipe" className={styles.recipe}>
                        <Recipe
                            recipe={recipe}
                            imageUrl={imageUrl}
                        />
                        </section>
                    </main>
                </div>
                <Footer />
                <Link to="#" className={classNames("back-to-top", styles.noPrint)} onClick={navBackToTop}>
                    <i className="material-icons">keyboard_arrow_up</i>
                </Link>
            </React.Fragment>
        );
    }
}
