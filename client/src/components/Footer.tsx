import classNames from 'classnames';
import styles from '../styles/Footer.module.scss';
import recipeStyles from '../styles/Recipe.module.scss';

export const Footer = () => {
    return (
        <footer className={classNames(styles.footer, recipeStyles.noPrint)}>
            <div className={styles.footerContent}>
                <div className={styles.copyright}>&copy;Copyright Emma Binns 2020. All Rights Reserved</div>
            </div>
        </footer>
    );
}