import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { setBackgroundWhenLoaded, smoothScrollDown } from '../utils';
import { CategoryCard } from './CategoryCard';
import { Header } from './Header';
import { Footer } from './Footer';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/Home.module.scss';

export const Home = () => {
    const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
    useEffect(() => {
        setBackgroundWhenLoaded(setIsBackgroundLoaded);
    }, [setIsBackgroundLoaded]);

    return (
        <React.Fragment>
            <Header isScrollable={true} />
            <div className={classNames(sharedStyles.pageContainer, {[sharedStyles.withBackgroundImage]: isBackgroundLoaded})}  id="scroll-top-container">
                <div className={classNames(styles.section, sharedStyles.hero)}>
                    <div className={sharedStyles.heroContainer}>
                        <h3>{"Welcome"}</h3>
                        <h1>{"This is Just a Bunch of Recipes"}</h1>
                        <h2>{"Seriously. That's all this is."}</h2>
                        <a onClick={(e) => smoothScrollDown(e, "#about")} className={sharedStyles.heroButton}>
                            {"I'm listening..."}
                        </a>
                    </div>
                </div>
                <main className={styles.homeContent}>
                    <div className={styles.section} id="about">
                        <div className={classNames(sharedStyles.topContainer, sharedStyles.expandOnSmallScreens)}>
                            <div className={styles.sectionTitle}>
                                <h2>{"About"}</h2>
                                <h3>{"Still Confused?"}</h3>
                                <p>{"I'm not here to tell you my life story."}</p>
                                <p>{"I'm not here to make money on ads."}</p>
                                <p>{"I'm not here to pretend either of us are professional chefs."}</p>
                                <p className={styles.emphasis}>
                                    {"I'm just here to give you clean, organized, straight-forward recipes."}
                                </p>
                                <p>{"If you have any suggestions for improvements or recipes to add, feel free to reach out!"}</p>
                            </div>
                        </div>
                    </div>
                    <div className={classNames(styles.section, styles.category)}>
                        <div className={classNames(sharedStyles.topContainer, sharedStyles.expandOnSmallScreens)}>
                            <div className={styles.sectionTitle}>
                                <h2>{"Explore"}</h2>
                                <h3>{"Start exploring some recipes!"}</h3>
                                <p>{"Select a category to begin exploring recipes, or use the Recipes button at the top of the page to search for and filter recipes."}</p>
                            </div>
                            <div className={styles.categoryCards}>
                                <CategoryCard
                                    url={`/recipes`}
                                    imageUrl={process.env.REACT_APP_CHILI_IMG_URL ?? require(`./../img/loading.png`)}
                                    title={`All`}
                                    subtitle={`Why limit yourself by arbitrary filters? Explore it all. Follow your heart.`}
                                />
                                <CategoryCard
                                    url={`recipes/?tag=vegetarian`}
                                    imageUrl={process.env.REACT_APP_GNOCCHI_IMG_URL ?? require(`./../img/loading.png`)}
                                    title={`Vegetarian`}
                                    subtitle={`Meatless options that still embrace cheese and eggs as the delicious friends they are.`}
                                />
                                <CategoryCard
                                    url={`recipes/?tag=vegan`}
                                    imageUrl={process.env.REACT_APP_YELLOW_CURRY_IMG_URL ?? require(`./../img/loading.png`)}
                                    title={`Vegan`}
                                    subtitle={`Good for you and the planet, what more can you ask for?`}
                                />
                                <CategoryCard
                                    url={`recipes/?tag=gluten-free`}
                                    imageUrl={process.env.REACT_APP_FRITATTA_IMG_URL ?? require(`./../img/loading.png`)}
                                    title={`Gluten-Free`}
                                    subtitle={`I'm sorry bread hates you. Hopefully these recipes provide some solace.`}
                                />
                                <CategoryCard
                                    url={`recipes/?tag=entree`}
                                    imageUrl={process.env.REACT_APP_SAAG_IMG_URL ?? require(`./../img/loading.png`)}
                                    title={`Entrees`}
                                    subtitle={`Any meal's main event. Or just an ambitious snack.`}
                                />
                                <CategoryCard
                                    url={`recipes/?tag=snack`}
                                    imageUrl={process.env.REACT_APP_TRUCK_STOP_IMG_URL ?? require(`./../img/loading.png`)}
                                    title={`Sides/Snacks`}
                                    subtitle={`Reliable sidekicks and little bites to get you through the day.`}
                                />
                                <CategoryCard
                                    url={`recipes/?tag=bread`}
                                    imageUrl={process.env.REACT_APP_STUFFING_BREAD_IMG_URL ?? require(`./../img/loading.png`)}
                                    title={`Breads`}
                                    subtitle={`Nothing makes you feel more like a wizard than successfully making bread. I stand by that.`}
                                />
                                <CategoryCard
                                    url={`recipes/?tag=dessert`}
                                    imageUrl={process.env.REACT_APP_BANOFFEE_IMG_URL ?? require(`./../img/loading.png`)}
                                    title={`Desserts`}
                                    subtitle={`Sweet bites for any time of day.`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={classNames(styles.section, styles.contact)}>
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
                    </div>
                </main>
            </div>
            <Footer />
        </React.Fragment>
    );
}
