import classNames from 'classnames';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/Header.module.scss';

export const Header = ({ isScrollable }: { isScrollable: boolean } ) => {
  return (
    <header id="header" className={classNames("fixed-top", {"header-unscrollable": !isScrollable})}>
      <div className={classNames(sharedStyles.topContainer, styles.headerContainer)}>
        <h1 className={styles.siteName}>
          <a href="../">Recipes</a>
        </h1>
        <nav className={classNames("navbar", "navbar-expand-lg")}>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon">
              <i className="material-icons">menu</i>
            </span>
          </button>
          <div className={classNames("collapse", "navbar-collapse", styles.navMenu)} id="collapsibleNavbar">
            <ul className="navbar-nav">
              <li>
                <a href="../">Home</a>
              </li>
              <li>
                <a href="../recipes/">Recipes</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );

  /**
   * Once recipe input page is working, add this button to the ul above:
   * <li>
        <a href="../recipe-input">Suggest a Recipe</a>
      </li>
   */
}