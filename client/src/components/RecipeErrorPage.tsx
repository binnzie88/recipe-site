import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { setBackgroundWhenLoaded } from '../utils';
import { Header } from './Header';
import { Footer } from './Footer';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/Recipe.module.scss';

export const RecipeErrorPage = ({ errorContent }: { errorContent: JSX.Element }) => {
    const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
    useEffect(() => {
        setBackgroundWhenLoaded(setIsBackgroundLoaded);
    }, [setIsBackgroundLoaded]);
    
    return (
        <React.Fragment>
            <Header isScrollable={true} />
                <div className={classNames(sharedStyles.pageContainer, {[sharedStyles.withBackgroundImage]: isBackgroundLoaded})} id="scroll-top-container">
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
