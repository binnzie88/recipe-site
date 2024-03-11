import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { navBackToTop } from '../utils';
import '../styles/App.css';

export const Home = () => {
  // Display home page
  // TODO: clean this up, break repeat code into helper function
  return (
    <React.Fragment>
      <Header />
      <div className="page-container">
        <section id="hero">
          <div className="hero-container">
            <h3>Welcome</h3>
            <h1>This is Just a Bunch of Recipes</h1>
            <h2>Seriously. That's all this is.</h2>
            <a href="#about" className="btn-get-started scrollto">I'm listening...</a>
          </div>
        </section>

        <main className="home-content" id="main">
          <section id="about">
            <div className="top-container">
              <div className="section-title">
                <h2>About</h2>
                <h3>Still Confused?</h3>
                <p>I'm not here to tell you my life story.<br/>
                  I'm not here to make money on ads.<br/>
                  I'm not here to pretend either of us are professional chefs.<br/><br/>
                  <strong>I'm just here to give you clean, organized, straight-forward recipes.</strong><br/><br/>
                  If you have any suggestions for improvements or recipes to add, feel free to reach out!</p>
              </div>
            </div>
          </section>

          <section id="category" className="category">
            <div className="top-container">
              <div className="section-title">
                <h2>Explore</h2>
                <h3>Start exploring some recipes!</h3>
                <p>Select a category to begin exploring recipes, or use the Recipes button at the top of the page to search for and filter recipes.</p>
              </div>

              <div className="row category-container">
                <div className="col-lg-3 col-md-4 col-sm-6 category-item filter-app">
                  <a href="/recipes">
                    <img src={require("./../img/lunch/chili_sq.jpeg")} className="img-fluid" alt="" />
                    <div className="category-info">
                      <h4>{"All"}</h4>
                      <p>{"Why limit yourself by arbitrary filters? Explore it all. Follow your heart."}</p>
                    </div>
                  </a>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 category-item filter-app">
                  <a href="recipes/?tag=vegetarian">
                    <img src={require("./../img/dinner/gnocchi_bake_sq.jpg")} className="img-fluid" alt="" />
                    <div className="category-info">
                      <h4>{"Vegetarian"}</h4>
                      <p>{"Meatless options that still embrace cheese and eggs as the delicious friends they are."}</p>
                    </div>
                  </a>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 category-item filter-card">
                  <a href="recipes/?tag=vegan">
                    <img src={require("./../img/dinner/yellow_curry_sq.jpeg")} className="img-fluid" alt="" />
                    <div className="category-info">
                      <h4>{"Vegan"}</h4>
                      <p>{"Good for you and the planet, what more can you ask for?"}</p>
                    </div>
                  </a>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 category-item filter-card">
                  <a href="recipes/?tag=gluten-free">
                    <img src={require("./../img/breakfast/fritatta_sq.png")} className="img-fluid" alt="" />
                    <div className="category-info">
                      <h4>{"Gluten-Free"}</h4>
                      <p>{"I'm sorry bread hates you. Hopefully these recipes provide some solace."}</p>
                    </div>
                  </a>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 category-item filter-web">
                  <a href="recipes/?tag=entree">
                    <img src={require("./../img/dinner/saag_sq.jpeg")} className="img-fluid" alt="" />
                    <div className="category-info">
                      <h4>{"Entrees"}</h4>
                      <p>{"Any meal's main event. Or just an ambitious snack."}</p>
                    </div>
                  </a>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 category-item filter-app">
                  <a href="recipes/?tag=side-snack">
                    <img src={require("./../img/breakfast/truck_stop_sq.jpg")} className="img-fluid" alt="" />
                    <div className="category-info">
                      <h4>{"Sides/Snacks"}</h4>
                      <p>{"Reliable sidekicks and little bites to get you through the day."}</p>
                    </div>
                  </a>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 category-item filter-card">
                  <a href="recipes/?tag=bread">
                    <img src={require("./../img/bread/soda_bread_sq.jpg")} className="img-fluid" alt="" />
                    <div className="category-info">
                      <h4>{"Breads"}</h4>
                      <p>{"Nothing makes you feel more like a wizard than successfully making bread. I stand by that."}</p>
                    </div>
                  </a>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 category-item filter-web">
                  <a href="recipes/?tag=dessert">
                    <img src={require("./../img/dessert/banoffee_sq.jpg")} className="img-fluid" alt="" />
                    <div className="category-info">
                      <h4>{"Desserts"}</h4>
                      <p>{"Sweet bites for any time of day."}</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="contact">
            <div className="top-container">
              <div className="section-title">
                <h2>Contact</h2>
              </div>
                <div className="info">
                  <div className="email">
                    <i className="material-icons">email</i>
                    <h4>Email:</h4>
                    <p>ebinns88@gmail.com</p>
                  </div>
                </div>
            </div>
          </section>

        </main>
      </div>
      <Footer />
      <a href="#" id="back-to-top" className="back-to-top no-print" onClick={navBackToTop}>
        <i className="material-icons">keyboard_arrow_up</i>
      </a>
    </React.Fragment>
  );
}
