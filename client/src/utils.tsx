import classNames from "classnames";
import { CollectionReference, doc, DocumentData, setDoc } from "firebase/firestore";
import { FirebaseStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import $ from "jquery";
import "jquery-ui-dist/jquery-ui";
import React from "react";
import { Link } from "react-router-dom";
import {  DIFFICULTY_TAGS, RECIPE_TYPE_TAGS } from "./consts";
import {
    DietaryNutritionInfo,
    DietarySelection,
    DifficultyTags,
    FormattedIngredientsOrStepsWithSubs,
    IngredientOrStep,
    IngredientOrStepInput,
    Inputs,
    isSubIngredientOrStepInput,
    NutritionInfoInputs,
    NutritionItem,
    NutritionItemInput,
    RecipeTypeTags,
    RecipeInfo,
    SubIngredientOrStepInput,
    TagInputs,
    Tags,
    NutritionStringItem,
} from "./types";
import { LoadingRecipeCard } from "./components/LoadingRecipeCard";
import headerStyles from "./styles/Header.module.scss";
import recipeStyles from "./styles/Recipe.module.scss";
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

/* ------- Data Fetch Utils --------------- */

export const getImageUrl = async (
    appStorage: FirebaseStorage,
    recipe: RecipeInfo | undefined,
    setRecipeImageUrl: (url: string | undefined) => void,
    isThumbnail?: true
) => {
    const imageUrl = isThumbnail ? recipe?.thumbnailImageUrl : recipe?.imageUrl;

    if (imageUrl === undefined) {
        return;
    }

    if (imageUrl !== undefined) {
        const imageRef = ref(appStorage, imageUrl);
        await getDownloadURL(imageRef)
            .then((url) => {
                setRecipeImageUrl(url);
            })
            .catch((error) => {
                console.error("Error getting image download URL for recipe:", error);
                setRecipeImageUrl(undefined);
            });
    }
};

/* ------- Recipe Search Page Utils ------- */

export function isRecipeVisibleWithSelectedTags(
    recipeTags: string[] | undefined,
    dietaryTags: DietarySelection[],
    difficultyTags: DifficultyTags[],
    recipeTypeTags: RecipeTypeTags[]
) {
    const areAnyTagsSelected = dietaryTags.length > 0 || difficultyTags.length > 0 || recipeTypeTags.length > 0;
    if (recipeTags === undefined) {
        return !areAnyTagsSelected;
    }
    const matchesAllDietaryTags =
        dietaryTags.length === 0 || 
        dietaryTags.every((tag) => recipeTags.includes(tag));
    const matchesAnyDifficultyTags =
        difficultyTags.length === 0 ||
        difficultyTags.some((tag) => recipeTags.includes(tag));
    const matchesAnyRecipeTypeTags =
        recipeTypeTags.length === 0 ||
        recipeTypeTags.some((tag) => recipeTags.includes(tag));
    return matchesAllDietaryTags && matchesAnyDifficultyTags && matchesAnyRecipeTypeTags;
}

export function getLoadingRecipeCards() {
    let loadingCards = [];
    for (var i = 0; i < 10; i++) {
        loadingCards.push(
            <div key={i} style={{position: 'relative', marginBottom: '15px'}}>
                <LoadingRecipeCard />
            </div>);
    }
    return loadingCards;
}

/* ---------- Recipe Page Utils ---------- */

function getIngredientOrStepForDietarySelection(
    ingredientOrStep: IngredientOrStep,
    dietarySelection: DietarySelection
) {
    if (dietarySelection === DietarySelection.GlutenFree && ingredientOrStep.glutenFreeSub !== undefined) {
        return ingredientOrStep.glutenFreeSub;
    }
    if (dietarySelection === DietarySelection.Vegan && ingredientOrStep.veganSub !== undefined) {
        return ingredientOrStep.veganSub;
    }
    if (dietarySelection === DietarySelection.Vegetarian && ingredientOrStep.vegetarianSub !== undefined) {
        return ingredientOrStep.vegetarianSub;
    }
    return ingredientOrStep.item;
}

export function getIngredientOrStepElements(
    items: IngredientOrStep[],
    dietarySelection: DietarySelection,
    isOrdered: boolean,
    listKey: string,
    parentIdxString?: string,
) {
    return items.reduce((filteredElements, item, idx) => {
        const itemForDietarySelection = getIngredientOrStepForDietarySelection(item, dietarySelection);
        if (itemForDietarySelection !== '') {
            const itemIdxString = parentIdxString ? `${parentIdxString}-${idx}` : `${idx}`
            const itemKey = `${listKey}-${itemIdxString}`;
            if (item.subItems !== undefined && item.subItems.length !== 0) {
                // Add nested list
                const subItemsList = 
                    getIngredientOrStepElements(item.subItems, dietarySelection, isOrdered, listKey, itemIdxString);
                filteredElements.push(isOrdered ? (
                    <li key={idx}>
                      {itemForDietarySelection}
                      <ol type="a">
                        {subItemsList}
                      </ol>
                    </li>
                  ) : (
                    <li key={idx}>
                      {itemForDietarySelection}
                      <ul>
                        {subItemsList}
                      </ul>
                    </li>
                  )
                );
            } else {
                filteredElements.push(
                    <li key={idx}>
                      {itemForDietarySelection}
                    </li>
                );
            }
        }
        return filteredElements;
    }, [] as JSX.Element[]);
}

export function getNutritionInfoElements(
    nutritionInfo: DietaryNutritionInfo | undefined,
    dietarySelection: DietarySelection,
) {
    if (nutritionInfo === undefined) {
        return null;
    }

    const nutritionInfoSections: JSX.Element[] = [];

    const servingInfoElement = getServingInfoElementForDietarySelection(nutritionInfo.servingSize, nutritionInfo.numServings, dietarySelection);

    if (servingInfoElement !== null) {
        nutritionInfoSections.push(servingInfoElement);
    }

    const nutritionMacroElements: JSX.Element[] = [];
    const caloriesElement = getNutritionElementForDietarySelection(nutritionInfo.calories, dietarySelection, 'Calories');
    const proteinElement = getNutritionElementForDietarySelection(nutritionInfo.proteinG, dietarySelection, 'Protein');
    const fiberElement = getNutritionElementForDietarySelection(nutritionInfo.fiberG, dietarySelection, 'Fiber');
    const fatElement = getNutritionElementForDietarySelection(nutritionInfo.fatG, dietarySelection, 'Fat');
    const sodiumElement = getNutritionElementForDietarySelection(nutritionInfo.sodiumMg, dietarySelection, 'Sodium');
    const sugarElement = getNutritionElementForDietarySelection(nutritionInfo.sugarG, dietarySelection, 'Sugar');

    if (caloriesElement !== null) {
        nutritionMacroElements.push(caloriesElement);
    }
    if (proteinElement !== null) {
        nutritionMacroElements.push(proteinElement);
    }
    if (fiberElement !== null) {
        nutritionMacroElements.push(fiberElement);
    }
    if (fatElement !== null) {
        nutritionMacroElements.push(fatElement);
    }
    if (sodiumElement !== null) {
        nutritionMacroElements.push(sodiumElement);
    }
    if (sugarElement !== null) {
        nutritionMacroElements.push(sugarElement);
    }

    if (nutritionMacroElements.length > 0) {
        if (nutritionInfoSections.length > 0) {
            // Add divider between serving info and macros
            nutritionInfoSections.push(<div className={recipeStyles.nutritionInfoDivider} />);
        }
        nutritionInfoSections.push(
            <div className={recipeStyles.nutritionInfoSection}>
                {nutritionMacroElements}
            </div>
        );
    }

    if (nutritionInfoSections.length > 0) {
        return (
            <div className={classNames(recipeStyles.nutritionInfoContainer, recipeStyles.printable)}>
                <h3>{`Nutrition Info`}</h3>
                {nutritionInfoSections}
            </div>
        )
    } else {
        return null;
    }
}

// TODO: UPDATE IMPLEMENTATION?
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
export function generateRandomIdString(length: number): string {
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        const newChar = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        id = `${id}${newChar}`;
    }
    return id;
}

export function buildFormattedRecipeWithoutImage(
    data: Inputs,
    formattedIngredientsWithSubs: FormattedIngredientsOrStepsWithSubs,
    formattedStepsWithSubs: FormattedIngredientsOrStepsWithSubs,
    dietaryOptions: DietarySelection[],
    tags: Tags[],
    nutritionInfo: DietaryNutritionInfo | undefined,
    imageUrl?: string,
) {
    const recipe: Omit<RecipeInfo, 'id'> = {
        name: data.name,
        ingredients: formattedIngredientsWithSubs.items,
        steps: formattedStepsWithSubs.items,
    };
    if (data.description !== '') {
        recipe.description = data.description;
    }
    if (data.time !== '') {
        recipe.time = data.time;
    }
    if (dietaryOptions.length > 0) {
        recipe.dietaryOptions = dietaryOptions;
    }
    if (data.servingSize !== '') {
        recipe.servingSize = data.servingSize;
    }
    if (data.numServings !== '') {
        recipe.numServings = data.numServings;
    }
    if (tags.length > 0) {
        recipe.tags = tags;
    }
    if (nutritionInfo !== undefined) {
        recipe.nutritionInfo = nutritionInfo;
    }
    if (data.notes.length > 0) {
        recipe.notes = data.notes.map((note) => note.note);
    }
    if (imageUrl !== undefined) {
        recipe.imageUrl = imageUrl;
    }

    return recipe;
}

export async function submitRecipe(
    recipeId: string,
    recipeWithoutImage: Omit<RecipeInfo, 'id'>,
    sourceImageBlob: Blob | undefined,
    thumbnailImageBlob: Blob | undefined,
    appStorage: FirebaseStorage | undefined,
    recipesCollection: CollectionReference<DocumentData, DocumentData>
) {
    const recipe = {...recipeWithoutImage};
    if (appStorage === undefined) {
        console.log("Cannot access image storage, saving recipe without image");
    } else {
        if (sourceImageBlob !== undefined) {
            const sourceImageUrl = await uploadImageAndGetUrl(sourceImageBlob, recipeId, appStorage);
            if (sourceImageUrl !== undefined) {
                recipe.imageUrl = sourceImageUrl;

                // Only add a thumbnail if the main image uploaded successfully
                if (thumbnailImageBlob !== undefined) {
                    const thumbnailImageUrl =
                        await uploadImageAndGetUrl(thumbnailImageBlob, `${recipeId}_thumbnail`, appStorage);
                    if (thumbnailImageUrl !== undefined) {
                        recipe.thumbnailImageUrl = thumbnailImageUrl;
                    } else {
                        console.log("Could not process thumbnail image, uploading recipe without thumbnail.");
                    }
                }
            } else {
                console.log("Could not process main image, uploading recipe without image.");
            }
        }
    }
    return await uploadRecipe(recipesCollection, recipe, recipeId);
}

export function getFormattedIngredientsOrSteps(inputs: (IngredientOrStepInput | SubIngredientOrStepInput)[]) {
    const formattedInputs = inputs.reduce((formattedItems, input) => {
        const { item, glutenFreeSub, veganSub, vegetarianSub } = input;
        if (item !== '') {
            const newItem: IngredientOrStep = { item };
            if (glutenFreeSub !== '') {
                newItem.glutenFreeSub = glutenFreeSub;
                formattedItems.hasGlutenFreeSub = true;
            }
            if (veganSub !== '') {
                newItem.veganSub = veganSub;
                formattedItems.hasVeganSub = true;
            }
            if (vegetarianSub !== '') {
                newItem.vegetarianSub = vegetarianSub;
                formattedItems.hasVegetarianSub = true;
            }
            if (isSubIngredientOrStepInput(input) && input.subItems.length > 0) {
                const formattedSubItems = getFormattedIngredientsOrSteps(input.subItems);
                if (formattedSubItems.items.length > 0) {
                    newItem.subItems = formattedSubItems.items;
                }
                formattedItems.hasGlutenFreeSub = formattedItems.hasGlutenFreeSub || formattedSubItems.hasGlutenFreeSub;
                formattedItems.hasVeganSub = formattedItems.hasVeganSub || formattedSubItems.hasVeganSub;
                formattedItems.hasVegetarianSub = formattedItems.hasVegetarianSub || formattedSubItems.hasVegetarianSub;
            }
            formattedItems.items.push(newItem);
        }
        return formattedItems;
    }, {
        items: [],
        hasGlutenFreeSub: false,
        hasVeganSub: false,
        hasVegetarianSub: false,
    } as FormattedIngredientsOrStepsWithSubs);
    return formattedInputs;
}

export function getFormattedTags(tags: TagInputs) {
    return [...DIFFICULTY_TAGS, ...RECIPE_TYPE_TAGS].reduce((checkedTags, tag) => {
        if (tags[tag] === true) {
            checkedTags.push(tag as Tags);
        }
        return checkedTags;
    }, [] as Tags[]);
}

export function getFormattedNutritionInfo(nutritionInfo: NutritionInfoInputs, dietaryOptions: DietarySelection[]) {
    const formattedNutritionInfo: DietaryNutritionInfo = {};

    const formattedCalories = getFormattedNutritionItem(nutritionInfo.calories, dietaryOptions);
    const formattedProtein = getFormattedNutritionItem(nutritionInfo.proteinG, dietaryOptions);
    const formattedFiber = getFormattedNutritionItem(nutritionInfo.fiberG, dietaryOptions);
    const formattedFat = getFormattedNutritionItem(nutritionInfo.fatG, dietaryOptions);
    const formattedSodium = getFormattedNutritionItem(nutritionInfo.sodiumMg, dietaryOptions);
    const formattedSugar = getFormattedNutritionItem(nutritionInfo.sugarG, dietaryOptions);

    if (
        !formattedCalories
        && !formattedProtein
        && !formattedFiber
        && !formattedFat
        && !formattedSodium
        && !formattedSugar
    ) {
        return undefined;
    }

    if (formattedCalories) {
        formattedNutritionInfo.calories = formattedCalories;
    }

    if (formattedProtein) {
        formattedNutritionInfo.proteinG = formattedProtein;
    }

    if (formattedFiber) {
        formattedNutritionInfo.fiberG = formattedFiber;
    }

    if (formattedFat) {
        formattedNutritionInfo.fatG = formattedFat;
    }

    if (formattedSodium) {
        formattedNutritionInfo.sodiumMg = formattedSodium;
    }

    if (formattedSugar) {
        formattedNutritionInfo.sugarG = formattedSugar;
    }

    return formattedNutritionInfo;
}

export async function getCompressedImageBlob(imageFile: File, isThumbnail: boolean) {
    try {
        return new Promise<Blob | undefined>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;

                img.onload = async () => {
                    const canvas = document.createElement('canvas');

                    // if image is not a thumbnail, scale it down as needed using its original dimensions
                    if (!isThumbnail) {
                        const MAX_WIDTH_OR_HEIGHT = 800;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH_OR_HEIGHT) {
                                height *= MAX_WIDTH_OR_HEIGHT / width;
                                width = MAX_WIDTH_OR_HEIGHT;
                            }
                        } else {
                            if (height > MAX_WIDTH_OR_HEIGHT) {
                                width *= MAX_WIDTH_OR_HEIGHT / height;
                                height = MAX_WIDTH_OR_HEIGHT;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        if (ctx === null) {
                            resolve(undefined);
                            return;
                        }

                        ctx.drawImage(img, 0, 0, width, height);
                    } else {
                        // If image is a thumbnail, crop and scale to a small square centered in the image
                        const WIDTH_AND_HEIGHT = 400;

                        let srcImageCropWidth = img.width;
                        let srcImageCropHeight = img.height;

                        let srcX = 0;
                        let srcY = 0;

                        if (srcImageCropWidth > srcImageCropHeight) {
                            srcImageCropWidth = srcImageCropHeight;
                            srcX = (img.width - srcImageCropHeight) / 2;
                        } else {
                            srcImageCropHeight = srcImageCropWidth;
                            srcY = (img.height - srcImageCropWidth) / 2;
                        }

                        const canvasWidth = WIDTH_AND_HEIGHT;
                        const canvasHeight = WIDTH_AND_HEIGHT;

                        canvas.width = canvasWidth;
                        canvas.height = canvasHeight;
                        const ctx = canvas.getContext('2d');
                        if (ctx === null) {
                            return;
                        }

                        ctx.drawImage(
                            img,
                            srcX,
                            srcY,
                            srcImageCropWidth,
                            srcImageCropHeight,
                            0,
                            0,
                            canvasWidth,
                            canvasHeight
                        );
                    }

                    // Get the compressed image as a Blob
                    canvas.toBlob((blob) => {
                        if (blob !== null) {
                            resolve(blob);
                        } else {
                            resolve(undefined);
                        }
                    }, 'image/jpeg');
                };

                img.onerror = (error) => {
                    console.log("Error loading image:", error);
                    resolve(undefined);
                };
            };

            reader.onerror = (error) => reject(error);
        });
    } catch (error) {
        console.error("Error loading image:", error);
        return undefined;
    }
}

export async function getDefaultThumbnailCrop(
    imageFile: File,
    setCroppedImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>,
) {
    try {
        return new Promise<string | undefined>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;

                img.onload = async () => {
                    // If user selected an image, shrink it, then upload it, then save recipe with resulting imageUrl
                    const WIDTH_AND_HEIGHT = 400;

                    let srcImageCropWidth = img.width;
                    let srcImageCropHeight = img.height;

                    let srcX = 0;
                    let srcY = 0;

                    if (srcImageCropWidth > srcImageCropHeight) {
                        srcImageCropWidth = srcImageCropHeight;
                        srcX = (img.width - srcImageCropHeight) / 2;
                    } else {
                        srcImageCropHeight = srcImageCropWidth;
                        srcY = (img.height - srcImageCropWidth) / 2;
                    }

                    const canvasWidth = WIDTH_AND_HEIGHT;
                    const canvasHeight = WIDTH_AND_HEIGHT;

                    const canvas = document.createElement('canvas');
                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;
                    const ctx = canvas.getContext('2d');
                    if (ctx === null) {
                        return;
                    }

                    ctx.drawImage(
                        img,
                        srcX,
                        srcY,
                        srcImageCropWidth,
                        srcImageCropHeight,
                        0,
                        0,
                        canvasWidth,
                        canvasHeight
                    );

                    // Get the compressed image as a Blob
                    const imageBlob = await new Promise<Blob | undefined>((resolveBlob) => {
                        canvas.toBlob((blob) => {
                        if (blob !== null) {
                            resolveBlob(blob);
                        } else {
                            resolveBlob(undefined);
                        }
                        }, 'image/jpeg');
                    });

                    if (imageBlob !== undefined) {
                        setCroppedImageUrl(URL.createObjectURL(imageBlob));
                    } else {
                        console.error("Could not crop thumbnail image due to a processing error.");
                    }
                };

                img.onerror = (error) => {
                    console.log("Error loading thumbnail image:", error);
                };
            };
        });
    } catch (error) {
        console.error("Error uploading image:", error);
    }
}

/* ---- Utils Only Used in Other Utils ---- */

async function uploadImageAndGetUrl(imageBlob: Blob, fileName: string, appStorage: FirebaseStorage | undefined) {
    if (appStorage === undefined) {
        console.log("Cannot upload image, saving recipe without image");
        return undefined;
    }
    try {
        return new Promise<string | undefined>(async (resolve) => {
            const storageRef = ref(appStorage, `recipeImages/${fileName}`);
                
            const uploadResult = await uploadBytes(storageRef, imageBlob);

            console.log("Uploaded image successfully!", uploadResult);
            resolve(getDownloadURL(uploadResult.ref));
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        return undefined;
    }
}

async function uploadRecipe(
    recipesCollection: CollectionReference<DocumentData, DocumentData>,
    recipe: Omit<RecipeInfo, 'id'>,
    recipeId: string,
) {
    try {
        const docRef = doc(recipesCollection, recipeId);
        await setDoc(docRef, recipe);
        console.log("Recipe successfully added with id: ", recipeId);
        return true;
    } catch (e) {
        console.error("Error adding document: ", e);
        return false;
    }
}

function getFormattedNutritionItem(nutritionItem: NutritionItemInput, dietaryOptions: DietarySelection[]) {
    if (
        nutritionItem.original === undefined
        && nutritionItem.glutenFree === undefined
        && nutritionItem.vegan === undefined
        && nutritionItem.vegetarian === undefined
    ) {
        return undefined;
    }

    const formattedNutritionItem: NutritionItem = {};
    if (nutritionItem.original) {
        formattedNutritionItem.original = nutritionItem.original;
    }
    if (nutritionItem.glutenFree && dietaryOptions.includes(DietarySelection.GlutenFree)) {
        formattedNutritionItem.glutenFree = nutritionItem.glutenFree;
    }
    if (nutritionItem.vegan && dietaryOptions.includes(DietarySelection.Vegan)) {
        formattedNutritionItem.vegan = nutritionItem.vegan;
    }
    if (nutritionItem.vegetarian && dietaryOptions.includes(DietarySelection.Vegetarian)) {
        formattedNutritionItem.vegetarian = nutritionItem.vegetarian;
    }
    return formattedNutritionItem;
}

function buildServingInfoElement(servingSize: string | undefined, numServings: number | undefined) {
    if (servingSize === undefined && numServings === undefined) {
        return null;
    }
    return (
        <div className={recipeStyles.nutritionInfoSection}>
            {numServings !== undefined && (
                <div className={recipeStyles.nutritionItem}>
                    <div className={recipeStyles.nutritionLabel}>{`Number of Servings: `}</div>
                    <div>{numServings}</div>
                </div>
            )}
            {servingSize !== undefined && (
                <div className={recipeStyles.nutritionItem}>
                    <div className={recipeStyles.nutritionLabel}>{`Serving Size: `}</div>
                    <div>{servingSize}</div>
                </div>
            )}
        </div>
    );
}

function getServingInfoElementForDietarySelection(
    servingSize: NutritionStringItem | undefined,
    numServings: NutritionItem | undefined,
    dietarySelection: DietarySelection
) {
    if (servingSize === undefined && numServings === undefined) {
        return null;
    }
    
    switch (dietarySelection) {
        case DietarySelection.Original:
            return buildServingInfoElement(
                servingSize?.original,
                numServings?.original,
            );
        case DietarySelection.GlutenFree:
            return buildServingInfoElement(
                servingSize?.glutenFree ?? servingSize?.original,
                numServings?.glutenFree ?? numServings?.original,
            );
        case DietarySelection.Vegan:
            return buildServingInfoElement(
                servingSize?.vegan ?? servingSize?.original,
                numServings?.vegan ?? numServings?.original,
            );
        case DietarySelection.Vegetarian:
            return buildServingInfoElement(
                servingSize?.vegetarian ?? servingSize?.original,
                numServings?.vegetarian ?? numServings?.original,
            );
        default:
            return null;
    }
}

function buildNutritionElement(label: string, nutritionItem: number | undefined) {
    if (nutritionItem === undefined) {
        return null;
    }
    return (
        <div className={recipeStyles.nutritionItem}>
            <div className={recipeStyles.nutritionLabel}>{`${label}: `}</div>
            <div>{nutritionItem}</div>
        </div>
    );
}

function getNutritionElementForDietarySelection(
    nutritionItem: NutritionItem | undefined,
    dietarySelection: DietarySelection,
    label: string
) {
    if (
        nutritionItem === undefined || (
            nutritionItem.original === undefined
            && nutritionItem.glutenFree === undefined
            && nutritionItem.vegan === undefined
            && nutritionItem.vegetarian === undefined
        )
    ) {
        return null;
    }

    switch (dietarySelection) {
        case DietarySelection.Original:
            return nutritionItem.original ? buildNutritionElement(label, nutritionItem.original) : null;
        case DietarySelection.GlutenFree:
            return (
                nutritionItem.glutenFree !== undefined
                    ? buildNutritionElement(label, nutritionItem.glutenFree)
                    : buildNutritionElement(label, nutritionItem.original)
            );
        case DietarySelection.Vegan:
            return (
                nutritionItem.vegan !== undefined
                    ? buildNutritionElement(label, nutritionItem.vegan)
                    : buildNutritionElement(label, nutritionItem.original)
            );
        case DietarySelection.Vegetarian:
            return (
                nutritionItem.vegetarian !== undefined
                    ? buildNutritionElement(label, nutritionItem.vegetarian)
                    : buildNutritionElement(label, nutritionItem.original)
            );
        default:
            return null;
    }
}

// TODO: figure out a way to get this working to allow links in recipe steps/ingredients
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
                <Link to={url}>{urlText}</Link>
                <span>{textAfterUrl}</span>
            </React.Fragment>
        );
    } else {
        return item;
    }
}
