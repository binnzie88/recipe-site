import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { RecipePage } from './components/RecipePage';
import { scrollPage } from "./utils";
import { RecipeSearchPage } from "./components/RecipeSearchPage";
import { RecipeInputPage } from "./components/RecipeInputPage";
import './styles/App.css';
import "normalize.css";

export default function App() {
  // Handle smooth scrolling
  window.addEventListener('scroll', scrollPage);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="recipes/*" element={<RecipeSearchPage />} />
        <Route path="recipe/*" element={<RecipePage />} />
        <Route path="recipe-input.html" element={<RecipeInputPage />} />
        <Route path="*" element={<div>{"Page Not Found"}</div>} />
      </Routes>
    </BrowserRouter>
  );
}
