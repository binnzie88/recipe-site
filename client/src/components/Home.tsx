import classNames from 'classnames';
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { smoothScrollDown } from '../utils';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/Home.module.scss';

export const Home = () => {
  // Build category cards
  const allCard = buildCategoryCard(
    "/recipes",
    <img src={require("./../img/lunch/chili_sq.jpeg")} className="img-fluid" alt="" />,
    "All",
    "Why limit yourself by arbitrary filters? Explore it all. Follow your heart."
  );
  const vegetarianCard = buildCategoryCard(
    "recipes/?tag=vegetarian",
    <img src={require("./../img/dinner/gnocchi_bake_sq.jpg")} className="img-fluid" alt="" />,
    "Vegetarian",
    "Meatless options that still embrace cheese and eggs as the delicious friends they are."
  );
  const veganCard = buildCategoryCard(
    "recipes/?tag=vegan",
    <img src={require("./../img/dinner/yellow_curry_sq.jpeg")} className="img-fluid" alt="" />,
    "Vegan",
    "Good for you and the planet, what more can you ask for?"
  );
  const glutenCard = buildCategoryCard(
    "recipes/?tag=gluten-free",
    <img src={require("./../img/breakfast/fritatta_sq.png")} className="img-fluid" alt="" />,
    "Gluten-Free",
    "I'm sorry bread hates you. Hopefully these recipes provide some solace."
  );
  const entreeCard = buildCategoryCard(
    "recipes/?tag=entree",
    <img src={require("./../img/dinner/saag_sq.jpeg")} className="img-fluid" alt="" />,
    "Entrees",
    "Any meal's main event. Or just an ambitious snack."
  );
  const sideCard = buildCategoryCard(
    "recipes/?tag=side-snack",
    <img src={require("./../img/breakfast/truck_stop_sq.jpg")} className="img-fluid" alt="" />,
    "Sides/Snacks",
    "Reliable sidekicks and little bites to get you through the day."
  );
  const breadCard = buildCategoryCard(
    "recipes/?tag=bread",
    <img src={require("./../img/bread/soda_bread_sq.jpg")} className="img-fluid" alt="" />,
    "Breads",
    "Nothing makes you feel more like a wizard than successfully making bread. I stand by that."
  );
  const dessertCard = buildCategoryCard(
    "recipes/?tag=dessert",
    <img src={require("./../img/dessert/banoffee_sq.jpg")} className="img-fluid" alt="" />,
    "Desserts",
    "Sweet bites for any time of day."
  );

  // Display home page
  return (
    <React.Fragment>
      <Header isScrollable={true} />
      <div className={sharedStyles.pageContainer}  id="scroll-top-container">
        <section className={sharedStyles.hero}>
          <div className={sharedStyles.heroContainer}>
            <h3>{"Welcome"}</h3>
            <h1>{"This is Just a Bunch of Recipes"}</h1>
            <h2>{"Seriously. That's all this is."}</h2>
            <a onClick={(e) => smoothScrollDown(e, "#about")} className={sharedStyles.heroButton}>
              {"I'm listening..."}
            </a>
          </div>
        </section>

        <main className={styles.homeContent}>
          <section id="about">
            <div className={classNames(sharedStyles.topContainer, sharedStyles.expandOnSmallScreens)}>
              <div className={styles.sectionTitle}>
                <h2>{"About"}</h2>
                <h3>{"Still Confused?"}</h3>
                <p>
                  {"I'm not here to tell you my life story."}<br/>
                  {"I'm not here to make money on ads."}<br/>
                  {"I'm not here to pretend either of us are professional chefs."}<br/><br/>
                  <strong>{"I'm just here to give you clean, organized, straight-forward recipes."}</strong><br/><br/>
                  {"If you have any suggestions for improvements or recipes to add, feel free to reach out!"}
                </p>
              </div>
            </div>
          </section>

          <section className={styles.category}>
            <div className={classNames(sharedStyles.topContainer, sharedStyles.expandOnSmallScreens)}>
              <div className={styles.sectionTitle}>
                <h2>{"Explore"}</h2>
                <h3>{"Start exploring some recipes!"}</h3>
                <p>{"Select a category to begin exploring recipes, or use the Recipes button at the top of the page to search for and filter recipes."}</p>
              </div>

              <div className="row">
                {allCard}
                {vegetarianCard}
                {veganCard}
                {glutenCard}
                {entreeCard}
                {sideCard}
                {breadCard}
                {dessertCard}
              </div>
            </div>
          </section>

          <section className={styles.contact}>
            <div className={classNames(sharedStyles.topContainer, sharedStyles.expandOnSmallScreens)}>
              <div className={styles.sectionTitle}>
                <h2>{"Contact"}</h2>
              </div>
                <div className={styles.info}>
                  <div className={styles.email}>
                    <i className="material-icons">email</i>
                    <h4>{"Email:"}</h4>
                    <p>{"ebinns88@gmail.com"}</p>
                  </div>
                </div>
            </div>
          </section>

        </main>
      </div>
      <Footer />
    </React.Fragment>
  );
}

function buildCategoryCard(url: string, img: JSX.Element, title: string, subtitle: string) {
  return (
    <div className={classNames(styles.categoryItem, "col-lg-3", "col-md-4", "col-sm-6")}>
      <a href={url}>
        {img}
        <div className={styles.categoryInfo}>
          <h4>{title}</h4>
          <p>{subtitle}</p>
        </div>
      </a>
    </div>
  );
}