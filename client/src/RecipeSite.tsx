import "normalize.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { initializeApp } from "firebase/app";
import { CollectionReference, collection, getDocs, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { scrollPage } from "./utils";
import { Ingredient, RecipeInfo, RecipesAndIngredientsContext } from "./types";
import { Home } from "./components/Home";
import { RecipePage } from './components/RecipePage';
import { RecipeSearchPage } from "./components/RecipeSearchPage";
import { RecipeSuggestionPage } from "./components/RecipeSuggestionPage";

export default function RecipeSite() {
    // Handle smooth scrolling
    window.addEventListener('scroll', scrollPage);

    const [recipes, setRecipes] = useState([] as RecipeInfo[]);
    const [recipesCollection, setRecipesCollection] = useState<CollectionReference>();
    const [ingredients, setIngredients] = useState([] as Ingredient[]);
    const [ingredientsCollection, setIngredientsCollection] = useState<CollectionReference>();
    const [appStorage, setAppStorage] = useState<FirebaseStorage>();

    // Firebase configuration
    const firebaseConfig = useMemo(() => {
        return {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID,
        };
    }, []);

    // TODO: if recipe db scales a lot, update this to store only the collection and get only the recipe(s) we need
    // on each individual page. Currently, getting all the recipes isn't that time-consuming, and it's preferable to
    // make one large db request upfront instead of making multiple over the course of a session in the app
    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);

        const getRecipes = async () => {
            const recipeCollection = collection(firestoreDb, "recipes");
            const recipesSnapshot = await getDocs(recipeCollection);

            const recipes: RecipeInfo[] = [];
            recipesSnapshot.forEach((doc) => {
                recipes.push({ ...doc.data(), id: doc.id } as RecipeInfo);
            });
            setRecipesCollection(recipeCollection);
            setRecipes(recipes);
        };

        const getIngredients = async () => {
            const ingredientsCollection = collection(firestoreDb, "ingredients");
            const ingredientsSnapshot = await getDocs(ingredientsCollection);

            const ingredients: Ingredient[] = [];
            ingredientsSnapshot.forEach((doc) => {
                ingredients.push({ ...doc.data(), id: doc.id } as Ingredient);
            });
            setIngredientsCollection(ingredientsCollection);
            setIngredients(ingredients);
        };

        setAppStorage(getStorage(app));
        getRecipes();
        getIngredients();
    }, []);

    return (
        <RecipesAndIngredientsContext.Provider
            value={{ appStorage, recipes, recipesCollection, ingredients, ingredientsCollection }}
        >
            <BrowserRouter>
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="recipes/*" element={<RecipeSearchPage />} />
                    <Route path="recipe/*" element={<RecipePage />} />
                    <Route path="suggest-recipe" element={<RecipeSuggestionPage />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </RecipesAndIngredientsContext.Provider>
    );
}
