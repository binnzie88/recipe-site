import classNames from 'classnames';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/RecipeSearchPage.module.scss';

export const LoadingRecipeCard = () => {
    return (
        <div className={classNames(styles.entryContainer, styles.loadingCard)}>
            <article className={styles.entry}>
                <div className={styles.imageContainer}>
                    <a><img src={require(`./../img/loading.png`)} alt="" className="img-fluid" /></a>
                </div>
                <div className={styles.entryInfoContainer}>
                    <h2 className={styles.entryTitle}>
                        {`Loading...`}
                    </h2>
                    <div className={styles.entryContent}>
                        <p>
                            {`Loading...`}
                        </p>
                    </div>
                    <div className={classNames(styles.entryCardFooter, sharedStyles.entryFooter)}>
                        <div className={classNames(styles.entryTags, sharedStyles.tagsContainer)}>
                            <i className="material-icons">local_offer</i>
                            <ul className={sharedStyles.tags}>
                                {[`Loading...`]}
                            </ul>
                        </div>
                        <div className={styles.viewRecipeContainer}>
                            <div className={styles.viewRecipe}>
                                <a>{`Loading...`}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
