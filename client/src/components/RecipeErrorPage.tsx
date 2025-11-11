import classNames from 'classnames';
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/Recipe.module.scss';

export const RecipeErrorPage = ({ errorContent }: { errorContent: JSX.Element }) => {
    return (
        <React.Fragment>
            <Header isScrollable={true} />
                <div className={classNames(sharedStyles.pageContainer)} id="scroll-top-container">
                    <section className={classNames(sharedStyles.hero, styles.noPrint)}>
                        <div className={sharedStyles.heroContainer}>
                            {errorContent}
                        </div>
                    </section>
                </div>
            <Footer />
        </React.Fragment>
    );
}
