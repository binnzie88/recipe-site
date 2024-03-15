import classNames from 'classnames';
import styles from '../styles/RecipeSearchPage.module.scss';
import sharedStyles from '../styles/CommonStyles.module.scss';
import { RecipeEntry } from '../types';

export const RecipeCard = ({ recipe }: { recipe: RecipeEntry }) => {
  const imageSplit = recipe.image.split(".");
  const recipeUrl = "../recipe/" + recipe.id;
  const recipeTags = recipe.tags.map((tag, idx) => {
    const maybeComma = idx < recipe.tags.length - 1 ? ",\xa0" : "";
    return (<li key={tag}><a href={"?tag=" + tag}>{tag}</a>{maybeComma}</li>);
  });

  return (
    <div className={classNames(styles.entryContainer, "col-med-12")}>
      <article className={classNames(styles.entry, "row")}>
        <div className="col-2">
          <a href={recipeUrl}><img src={require("./../img/" + imageSplit[0] + "_sq." + imageSplit[1])} alt="" className="img-fluid" /></a>
        </div>
        <div className="col-10">
          <h2 className={styles.entryTitle}>
            <a href={recipeUrl}>{recipe.title}</a>
          </h2>
          <div className={styles.entryContent}>
            <p>
              {recipe.subtitle}
            </p>
          </div>
          <div className={classNames(styles.entryCardFooter, sharedStyles.entryFooter)}>
            <div className={classNames(styles.entryTags, sharedStyles.tagsContainer)}>
              <i className="material-icons">local_offer</i>
              <ul className={sharedStyles.tags}>
                {recipeTags}
              </ul>
            </div>
            <div className={styles.viewRecipeContainer}>
              <div className={styles.viewRecipe}>
                <a href={recipeUrl}>View Recipe</a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
