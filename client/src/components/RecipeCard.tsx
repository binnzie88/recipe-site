import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RecipeInfo } from '../types';
import { ComingSoonImageThumbnail } from './ComingSoonImage';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/RecipeSearchPage.module.scss';

export const RecipeCard = ({ recipe }: { recipe: RecipeInfo }) => {
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(recipe.thumbnailImageUrl);

    const showPlaceholderThumbnail = useMemo(() => !isImageLoaded || imageUrl === undefined, [isImageLoaded, imageUrl]);

    const onImageLoaded = useCallback(() => {
        setIsImageLoaded(true);
    }, [setIsImageLoaded]);

    const onImageLoadError = useCallback(() => {
        setImageUrl(undefined);
        setIsImageLoaded(true);
    }, [setImageUrl, setIsImageLoaded]);

    const thumbnail = useMemo(() => {
        const className = classNames("img-fluid", styles.thumbnail);
        return (
            imageUrl === undefined
                ? <ComingSoonImageThumbnail className={className} onLoad={onImageLoaded} onError={onImageLoadError} />
                : <img
                    src={imageUrl}
                    alt={recipe.name}
                    className={className}
                    onLoad={onImageLoaded}
                    onError={onImageLoadError}
                />
        );
    }, [imageUrl, onImageLoaded, onImageLoadError]);

    const recipeUrl = useMemo(() => `../recipe/${recipe.id}`, [recipe.id]);;
    const recipeTags = useMemo(() => {
        const tags = recipe.tags;
        if (tags === undefined) {
            return null;
        }
        return tags.map((tag, idx) => {
            const maybeComma = idx < tags.length - 1 ? ",\xa0" : "";
            return (<li key={`${recipe.id}-tag-${tag}`}><Link to={`?tag=${tag}`}>{tag}</Link>{maybeComma}</li>);
        });
    }, [recipe.tags]);

    return (
        <div className={styles.recipeCardContainer}>
            <div className={classNames(styles.entryContainer)}>
                <article className={styles.entry}>
                    <div className={styles.thumbnailContainer}>
                        <Link className={classNames(styles.thumbnailWrapper, {[styles.visibleImage]: !showPlaceholderThumbnail})} to={recipeUrl}>
                            {thumbnail}
                        </Link>
                        <Link className={classNames(styles.thumbnailWrapper, {[styles.visibleImage]: showPlaceholderThumbnail})} to={recipeUrl}>
                            <img src={require(`./../img/loading.png`)} alt="" className={classNames("img-fluid", styles.thumbnail)} />
                        </Link>
                    </div>
                    <div className={styles.entryInfoContainer}>
                        <h2 className={styles.entryTitle}>
                            <Link to={recipeUrl}>{recipe.name}</Link>
                        </h2>
                        <div className={styles.entryContent}>
                            <p>
                                {recipe.description}
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
                                    <Link to={recipeUrl}>{`View Recipe`}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
