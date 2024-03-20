import "normalize.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { RecipePage } from './components/RecipePage';
import { RecipeSearchPage } from "./components/RecipeSearchPage";
import { RecipeSuggestionPage } from "./components/RecipeSuggestionPage";
import { scrollPage } from "./utils";


export default function RecipeSite() {
  // Handle smooth scrolling
  window.addEventListener('scroll', scrollPage);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="recipes/*" element={<RecipeSearchPage />} />
        <Route path="recipe/*" element={<RecipePage />} />
        <Route path="suggest-recipe" element={<RecipeSuggestionPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
