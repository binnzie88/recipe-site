import $ from "jquery";
import "jquery-ui-dist/jquery-ui";
import { DietarySelection, Tag } from "./types";
import React from "react";
import headerStyles from "./styles/Header.module.scss";
import recipeSearchStyles from "./styles/RecipeSearchPage.module.scss";
import { LoadingRecipeCard } from "./components/LoadingRecipeCard";
import { DietarySelectionIndices } from "./consts";

export function getDietaryRestrictionAndSubstitute(tag: Tag) {
  if (tag === Tag.Vegan || tag === Tag.VeganSubstitute) {
    return [Tag.Vegan, Tag.VeganSubstitute];
  } else if (tag === Tag.Vegetarian || tag === Tag.VegetarianSubstitute) {
    return [Tag.Vegetarian, Tag.VegetarianSubstitute];
  } else if (tag === Tag.GlutenFree || tag === Tag.GlutenFreeSubstitute) {
    return [Tag.GlutenFree, Tag.GlutenFreeSubstitute];
  } else {
    return [];
  }
}

export function createTagFilter(tag: Tag, className: string, onClick: () => void, defaultChecked: boolean, buttonText: string) {
  return (
    <li className={recipeSearchStyles.tagFilter} key={tag}>
      <input className={className} type="checkbox" onClick={onClick} id={tag} defaultChecked={defaultChecked} />
      <div className={recipeSearchStyles.tagFilterLabel}>
        {buttonText}
      </div>
    </li>
  );
}

export function setSelectedTags(className: string, setSelectionCallback: (value: React.SetStateAction<Tag[]>) => void) {
  const checkboxes = Array.from(document.getElementsByClassName(className)) as HTMLInputElement[];
  const newSelectedTags = checkboxes.filter((checkbox) => {return checkbox.checked}).map((checkbox) => checkbox.id as Tag);
  setSelectionCallback(newSelectedTags);
}

export function isRecipeVisibleWithSelectedTags(recipeTags: string[], dietaryTags: Tag[], difficultyTags: Tag[], categoryTags: Tag[]) {
  const matchesAllDietaryTags = dietaryTags.length === 0 || dietaryTags.every((tag) => getDietaryRestrictionAndSubstitute(tag).some((t) => recipeTags.includes(t)));
  const matchesAnyDifficultyTags = difficultyTags.length === 0 || difficultyTags.some((tag) => recipeTags.includes(tag));
  const matchesAnyCategoryTags = categoryTags.length === 0 || categoryTags.some((tag) => recipeTags.includes(tag));
  return matchesAllDietaryTags && matchesAnyDifficultyTags && matchesAnyCategoryTags;
}

export function getIngredients() {
  var ingredients = document.getElementById('ingredient-list')?.innerText;
  var tmp = document.createElement('textarea');
  
  if (ingredients != null) {
    tmp.value = ingredients;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    window.alert("Copied the Following Ingredients: \n"+ingredients);
  } else {
    window.alert("Failed to copy ingredients. Please try again.");
  }
}

export function scrollPage() {
  const recipeContainer = document.getElementById("scroll-top-container");
  if (recipeContainer != null) {
    if ($(window).scrollTop()) {
      $("#header").addClass(headerStyles.headerScrolled);
      $(".back-to-top").fadeIn("slow");
    } else {
      $("#header").removeClass(headerStyles.headerScrolled);
      $(".back-to-top").fadeOut("slow");
    }
  }
}

export function navBackToTop() {
  $('html, body').animate({
    scrollTop: 0
  }, 1250, 'easeInOutExpo');
}

export function smoothScrollDown(e: React.MouseEvent<HTMLElement>, targetId: string) {
  e.preventDefault();
  var targetOffset = $(targetId).offset();
  if (targetOffset != null) {
    var scrollto = targetOffset.top;
    var scrolled = 20;

    var header = $('#header');
    var headerOuterHeight = header.outerHeight();
    if (headerOuterHeight != null) {
      scrollto -= headerOuterHeight;
      if (!header.hasClass(headerStyles.headerScrolled)) {
        scrollto += scrolled;
      }
    }

    $('html, body').animate({
      scrollTop: scrollto
    }, 1250, 'easeInOutExpo');
  }
}

export function maybeConvertStringWithLink(item: string) {
  if (item.includes("<a href")) {
    // Item contains a link, return an element that displays that link
    const url = item.split("href=\"")[1].split("\"")[0];
    const textBeforeUrl = item.split("<a href")[0];
    const urlText = item.split("\">")[1].split("</a>")[0];
    const textAfterUrl = item.split("</a>")[1];
    return (
      <React.Fragment>
        <span>{textBeforeUrl}</span>
        <a href={url}>{urlText}</a>
        <span>{textAfterUrl}</span>
      </React.Fragment>
    );
  } else {
    return item;
  }
}

export function getItemForDietarySelection(rawItem: string, index: number) {
  if (rawItem.includes("///")) {
    const variations = rawItem.split("///");
    const originalItem = variations[0];
    const maybeItem = variations[index];
    return maybeItem === "omit" ? null : maybeConvertStringWithLink((index === 0 || maybeItem === null || maybeItem === "none") ? originalItem : maybeItem);
  } else {
    return maybeConvertStringWithLink(rawItem);
  }
}

export function buildMaybeNestedList(items: string[][], dietarySelection: DietarySelection, isOrdered: boolean) {
  const indexOfDietarySelection = DietarySelectionIndices.get(dietarySelection) ?? 0;
  return items.map((subItems, idx) => {
    if (subItems.length === 1) {
      const rawItem = subItems[0];
      const itemForDietarySelection = getItemForDietarySelection(rawItem, indexOfDietarySelection);
      return itemForDietarySelection != null ? <li key={idx}>{itemForDietarySelection}</li> : null;
    } else if (subItems.length > 1) {
      const rawTopLevelItem = subItems[0];
      const topLevelItem = getItemForDietarySelection(rawTopLevelItem, indexOfDietarySelection);
      if (topLevelItem != null) {
        const subItemsList = subItems.map((rawSubItem, i) => {
          if (i === 0) {
            return null;
          } else {
            const subItem = getItemForDietarySelection(rawSubItem, indexOfDietarySelection);
            return subItem != null ? <li key={i}>{subItem}</li> : null;
          }
        }).filter((element) => element != null);
        return isOrdered ? 
          (
            <li key={idx}>
              {topLevelItem}
              <ol type="a">
                {subItemsList}
              </ol>
            </li>
          )
        :
          (
            <li key={idx}>
              {topLevelItem}
              <ul>
                {subItemsList}
              </ul>
            </li>
          );
      } else {
        return null;
      }
    } else {
      return null;
    }
  });
}

export function getDietarySelectionItems(rawItems: string[][], substitutions: DietarySelection[], isOrdered: boolean) {
  const itemsByDietarySelection: Map<DietarySelection, (JSX.Element | null)[]> = new Map<DietarySelection, (JSX.Element | null)[]>();
  
  const originalIngredientsList = buildMaybeNestedList(rawItems, DietarySelection.Original, isOrdered);
  itemsByDietarySelection.set(DietarySelection.Original, originalIngredientsList);

  substitutions.forEach((dietarySelection) => {
    const dietarySelectionItems = buildMaybeNestedList(rawItems, dietarySelection, isOrdered);
    itemsByDietarySelection.set(dietarySelection, dietarySelectionItems);
  });

  return itemsByDietarySelection;
}

export function getLoadingRecipeCards() {
  return [
    <LoadingRecipeCard />,
    <LoadingRecipeCard />,
    <LoadingRecipeCard />,
    <LoadingRecipeCard />,
    <LoadingRecipeCard />,
    <LoadingRecipeCard />,
    <LoadingRecipeCard />,
    <LoadingRecipeCard />,
    <LoadingRecipeCard />,
    <LoadingRecipeCard />,
  ];
}