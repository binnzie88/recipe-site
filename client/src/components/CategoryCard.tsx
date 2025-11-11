import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ComingSoonImageThumbnail } from './ComingSoonImage';
import styles from '../styles/Home.module.scss';

export const CategoryCard = ({
    url, imageUrl, title, subtitle
}:{
    url: string, imageUrl: string, title: string, subtitle: string
}) => {
    const [didImageError, setDidImageError] = useState(false);
    const onImageError = useCallback(() => setDidImageError(true), [setDidImageError]);

    return (
        <div className={styles.categoryItem}>
            <Link to={url} className={styles.categoryLink}>
                {didImageError
                    ? <ComingSoonImageThumbnail className={"img-fluid"} />
                    : <img src={imageUrl} className="img-fluid" alt="" onError={onImageError} />
                }
                <div className={styles.categoryInfo}>
                    <h4>{title}</h4>
                    <p>{subtitle}</p>
                </div>
            </Link>
        </div>
    );
}
