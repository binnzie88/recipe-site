import $ from "jquery";
import "jquery-ui-dist/jquery-ui";
import React from "react";
import { LoadingRecipeCard } from "./components/LoadingRecipeCard";
import { DietarySelectionIndices } from "./consts";
import { DietarySelection, NestedSuggestionInput, Tag } from "./types";
import headerStyles from "./styles/Header.module.scss";
import recipeSearchStyles from "./styles/RecipeSearchPage.module.scss";

/* ---------- General Site Utils ---------- */

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

/* ------- Recipe Search Page Utils ------- */

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

export function createTagFilter(
  tag: Tag, className: string,
  onClick: () => void, defaultChecked: boolean, buttonText: string
) {
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
  const newSelectedTags = 
    checkboxes.filter((checkbox) => {return checkbox.checked}).map((checkbox) => checkbox.id as Tag);
  setSelectionCallback(newSelectedTags);
}

export function isRecipeVisibleWithSelectedTags(
  recipeTags: string[],
  dietaryTags: Tag[],
  difficultyTags: Tag[],
  categoryTags: Tag[]
) {
  const matchesAllDietaryTags =
    dietaryTags.length === 0 || 
    dietaryTags.every((tag) => getDietaryRestrictionAndSubstitute(tag).some((t) => recipeTags.includes(t)));
  const matchesAnyDifficultyTags =
    difficultyTags.length === 0 ||
    difficultyTags.some((tag) => recipeTags.includes(tag));
  const matchesAnyCategoryTags =
    categoryTags.length === 0 ||
    categoryTags.some((tag) => recipeTags.includes(tag));
  return matchesAllDietaryTags && matchesAnyDifficultyTags && matchesAnyCategoryTags;
}

export function getLoadingRecipeCards() {
  let loadingCards = [];
  for (var i = 0; i < 10; i++) {
    loadingCards.push(<LoadingRecipeCard key={i} />);
  }
  return loadingCards;
}

/* ---------- Recipe Page Utils ---------- */

export function getDietarySelectionItems(
  rawItems: string[][],
  substitutions: DietarySelection[],
  isOrdered: boolean
) {
  const itemsByDietarySelection: Map<DietarySelection, (JSX.Element | null)[]> = 
    new Map<DietarySelection, (JSX.Element | null)[]>();

  const originalIngredientsList = buildMaybeNestedList(rawItems, DietarySelection.Original, isOrdered);

  itemsByDietarySelection.set(DietarySelection.Original, originalIngredientsList);
  substitutions.forEach((dietarySelection) => {
    const dietarySelectionItems = buildMaybeNestedList(rawItems, dietarySelection, isOrdered);
    itemsByDietarySelection.set(dietarySelection, dietarySelectionItems);
  });
  return itemsByDietarySelection;
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

/* ----- Recipe Suggestion Page Utils ----- */

export function addInput(
  inputs: NestedSuggestionInput[],
  setInputs: React.Dispatch<React.SetStateAction<NestedSuggestionInput[]>>,
  parentIdx?: number,
) {
  if (parentIdx == null) {
    // add top level input
    setInputs([...inputs, { inputText: "", substitutions: new Map<Tag, string>(), subInputs:[] }]);
  } else {
    // add sub input
    const parentInput = inputs[parentIdx];
    if (parentInput != null) {
      const newInputs = [...inputs];
      newInputs[parentIdx].subInputs = [
        ...parentInput.subInputs,
        { subInputText: "", substitutions: new Map<Tag, string>() }
      ];
      setInputs(newInputs);
    }
  }
}

export function addInputSubstitution(
  inputs: NestedSuggestionInput[],
  setInputs: React.Dispatch<React.SetStateAction<NestedSuggestionInput[]>>,
  diet: Tag,
  idx: number,
  parentIdx?: number
) {
  if (parentIdx == null) {
    // add substitution to top level input
    const input = inputs[idx];
    if (input != null) {
      const newInputs = [...inputs];
      newInputs[idx].substitutions.set(diet, "");
      setInputs(newInputs);
    }
  } else {
    // add substitution to sub level input
    const parentInput = inputs[parentIdx];
    if (parentInput != null) {
      const subInput = parentInput.subInputs[idx];
      if (subInput != null) {
        const newInputs = [...inputs];
        const newSubInputs = [...parentInput.subInputs];
        newSubInputs[idx].substitutions.set(diet, "");
        newInputs[parentIdx].subInputs = newSubInputs;
        setInputs(newInputs);
      }
    }
  } 
}

export function deleteInput(
  inputs: NestedSuggestionInput[],
  setInputs: React.Dispatch<React.SetStateAction<NestedSuggestionInput[]>>,
  idx: number,
  parentIdx?: number
) {
  if (parentIdx == null) {
    // delete top level input
    const newInputs = [...inputs];
    newInputs.splice(idx, 1);
    setInputs(newInputs);
  } else {
    // delete sub input
    const parentInput = inputs[parentIdx];
    if (parentInput != null) {
      const newSubInputs = [...parentInput.subInputs];
      newSubInputs.splice(idx, 1);
      const newInputs = [...inputs];
      newInputs[parentIdx] = {
        inputText: parentInput.inputText,
        substitutions: parentInput.substitutions,
        subInputs: newSubInputs,
      };
      setInputs(newInputs);
    }
  }
}

export function deleteInputSubstitution (
  inputs: NestedSuggestionInput[],
  setInputs: React.Dispatch<React.SetStateAction<NestedSuggestionInput[]>>,
  diet: Tag,
  idx: number,
  parentIdx?: number,
) {
  if (parentIdx == null) {
    // delete top level input substitution
    const input = inputs[idx];
    if (input != null) {
      const newInputs = [...inputs];
      newInputs[idx].substitutions.delete(diet);
      setInputs(newInputs);
    }
  } else {
    // delete sub input substitution
    const parentInput = inputs[parentIdx];
    if (parentInput != null) {
      const newSubInputs = [...parentInput.subInputs];
      newSubInputs[idx].substitutions.delete(diet);
      const newInputs = [...inputs];
      newInputs[parentIdx] = {
        inputText: parentInput.inputText,
        substitutions: parentInput.substitutions,
        subInputs: newSubInputs,
      };
      setInputs(newInputs);
    }
  }
}

export function updateInput(
  inputs: NestedSuggestionInput[],
  setInputs: React.Dispatch<React.SetStateAction<NestedSuggestionInput[]>>,
  element: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  idx: number,
  parentIdx?: number
) {
  if (parentIdx == null) {
    // update top level input
    const input = inputs[idx];
    if (input != null) {
      const newInputs = [...inputs];
      newInputs[idx].inputText = element.target.value;
      setInputs(newInputs);
    }
  } else {
    // update sub input
    const parentInput = inputs[parentIdx];
    if (parentInput != null) {
      const subInput = parentInput.subInputs[idx];
      if (subInput != null) {
        const newInputs = [...inputs];
        const newSubInputs = [...parentInput.subInputs];
        newSubInputs[idx].subInputText = element.target.value;
        newInputs[parentIdx].subInputs = newSubInputs;
        setInputs(newInputs);
      }
    }
  }
}

export function updateInputSubstitution(
  inputs: NestedSuggestionInput[],
  setInputs: React.Dispatch<React.SetStateAction<NestedSuggestionInput[]>>,
  diet: Tag,
  element: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  idx: number,
  parentIdx?: number,
) {
  if (parentIdx == null) {
    // update top level input substitutions
    const input = inputs[idx];
    if (input != null) {
      const newInputs = [...inputs];
      newInputs[idx].substitutions.set(diet, element.target.value);
      setInputs(newInputs);
    }
  } else {
    // update sub input substitutions
    const parentInput = inputs[parentIdx];
    if (parentInput != null) {
      const subInput = parentInput.subInputs[idx];
      if (subInput != null) {
        const newInputs = [...inputs];
        const newSubInputs = [...parentInput.subInputs];
        newSubInputs[idx].substitutions.set(diet, element.target.value);
        newInputs[parentIdx].subInputs = newSubInputs;
        setInputs(newInputs);
      }
    }
  }
}

export function getFormattedSuggestionInputs(ingredients: NestedSuggestionInput[], steps: NestedSuggestionInput[], notes: NestedSuggestionInput[]) {
  const id = `"` + cleanRawInput($("input#recipeId").val()) + `", `;
  const title = `"` + cleanRawInput($("input#title").val()) + `", `;
  const subtitle = `"` + cleanRawInput($("input#subtitle").val()) + `", `;
  const time = `"` + cleanRawInput($("input#time").val()) + `", `;
  const imageUrl = `"` + cleanRawInput($("input#imageUrl").val()) + `", `;

  let formattedTags = `'[`;
  const tags = Array.from($(".tag:checkbox:checked").map(function () { return $(this).val(); }));
  tags.forEach((tag, idx) => {
    formattedTags += `"` + tag + `"`;
    if (idx < tags.length - 1) {
      formattedTags += `, `;
    }
  });
  formattedTags += `]'`;

  const formattedIngredients = formatNestedInputs(ingredients) + `, `;
  const formattedSteps = formatNestedInputs(steps) + `, `;
  let formattedNotes = `'[`;
  notes.forEach((input, idx) => {
    formattedNotes += `"` + cleanNestedInput(input.inputText) + `"`;
    if (idx < notes.length - 1) {
      formattedNotes += `, `;
    }
  });
  formattedNotes += `]', `;

  return { id, title, subtitle, time, imageUrl, formattedIngredients, formattedSteps, formattedNotes, formattedTags };
}

export function copyRecipe(recipeString: string) {
  var tmp = document.createElement('textarea');
  tmp.value = recipeString;
  document.body.appendChild(tmp);
  tmp.select();
  document.execCommand('copy');
  document.body.removeChild(tmp);
  window.alert("Copied the Following Ingredients: \n"+recipeString);
}

/* ---- Utils Only Used in Other Utils ---- */

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
    return maybeItem === "omit" 
      ? null 
      : maybeConvertStringWithLink(
          (index === 0 || maybeItem === null || maybeItem === "none")
            ? originalItem
            : maybeItem
        );
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
        return isOrdered ? (
          <li key={idx}>
            {topLevelItem}
            <ol type="a">
              {subItemsList}
            </ol>
          </li>
        ) : (
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

export function formatNestedInputs(inputs: NestedSuggestionInput[]) {
  let outputString = `'[`;
  inputs.forEach((input, idx) => {
    outputString += (`["` + createInputTextWithSubstitutions(input.inputText, input.substitutions) + `"`);
    input.subInputs.forEach((subInput) => {
      outputString += (`, "` + createInputTextWithSubstitutions(subInput.subInputText, subInput.substitutions) + `"`)
    });
    outputString += (`]`);
    if (idx < inputs.length - 1) {
      outputString += (`, `);
    }
  });
  outputString += `]'`;
  return outputString;
}

export function createInputTextWithSubstitutions(inputText: string, substitutions: Map<Tag, string>) {
  if (substitutions.size === 0) {
    return cleanNestedInput(inputText);
  } else {
    const vegetarianSub = substitutions.get(Tag.Vegetarian) ?? "none";
    const veganSub = substitutions.get(Tag.Vegan) ?? "none";
    const glutenFreeSub = substitutions.get(Tag.GlutenFree) ?? "none";
    return cleanNestedInput(inputText + "///" + vegetarianSub + "///" + veganSub + "///" + glutenFreeSub);
  }
}

export function cleanRawInput(inputVal: string | number | string[] | undefined) {
  if (inputVal != null) {
    return (inputVal.toString().replaceAll(`"`, `\\"`));
  } else {
    return "";
  }
}

export function cleanNestedInput(inputText: string) {
  return inputText.replaceAll("'", "\\'").replaceAll('"', '\\\\"');
}
