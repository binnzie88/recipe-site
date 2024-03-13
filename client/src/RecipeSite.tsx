import { Amplify } from 'aws-amplify';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import amplifyconfig from './amplifyconfiguration.json';
import { Home } from "./components/Home";
import { RecipePage } from './components/RecipePage';
import { scrollPage } from "./utils";
import { RecipeSearchPage } from "./components/RecipeSearchPage";
import { RecipeInputPage } from "./components/RecipeInputPage";
import "normalize.css";

Amplify.configure(amplifyconfig);

export default function RecipeSite() {
  // Handle smooth scrolling
  window.addEventListener('scroll', scrollPage);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="recipes/*" element={<RecipeSearchPage />} />
        <Route path="recipe/*" element={<RecipePage />} />
        <Route path="recipe-input.html" element={<RecipeInputPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
