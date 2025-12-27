import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/Header.module.scss';

export const Header = ({ isScrollable }: { isScrollable: boolean } ) => {
    const [isNavBarExpanded, setIsNavBarExpanded] = useState(false);
    const toggleIsNavBarExpanded = useCallback(() => setIsNavBarExpanded((prevVal) => !prevVal), [setIsNavBarExpanded]);

    return (
        <header id="header" className={classNames({[styles.headerUnscrollable]: !isScrollable})}>
            <div className={classNames(sharedStyles.topContainer, styles.headerContainer)}>
                <h1 className={styles.siteName}>
                    <Link to={`../`}>Recipes</Link>
                </h1>
                <nav className={styles.navBar}>
                    <button className={styles.collapsedNavBar} type="button" onClick={toggleIsNavBarExpanded}>
                        <span className={styles.collapsedNavBarIconContainer}>
                            <i className={classNames("material-icons", styles.collapsedNavBarIcon)}>menu</i>
                        </span>
                    </button>
                    <div
                        className={classNames(styles.navBarList, {[styles.expanded]: isNavBarExpanded}, styles.navMenu)}
                    >
                        <div className={styles.navBarContent}>
                            <Link to={`../`}>Home</Link>
                            <Link to={`../recipes/`}>Recipes</Link>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}