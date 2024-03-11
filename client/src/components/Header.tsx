import '../styles/App.css';

export const Header = () => {
  return (
    <header id="header" className="fixed-top header-inner-pages">
      <div className="top-container d-flex align-items-top">
        <h1 className="logo mr-auto">
          <a href="../">Recipes</a>
        </h1>
        <nav className="navbar navbar-expand-lg">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon">
              <i className="material-icons">menu</i>
            </span>
          </button>
          <div className="collapse navbar-collapse nav-menu" id="collapsibleNavbar">
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