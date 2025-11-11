import classNames from 'classnames';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    Control,
    FieldArrayWithId,
    SubmitHandler,
    useFieldArray,
    UseFieldArrayRemove,
    useForm,
    UseFormRegister,
} from 'react-hook-form';
import {
    DietarySelectionButtonText,
    DIETARY_TAGS,
    DIFFICULTY_TAGS,
    NUTRITION_ITEMS,
    RECIPE_TYPE_TAGS,
} from '../consts';
import {
    DietarySelection,
    DifficultyTagLabelsMap,
    DifficultyTags,
    Inputs,
    NutritionItemLabelText,
    NutritionItemTypes,
    RecipesAndIngredientsContext,
    RecipeTypeTagLabelsMap,
    RecipeTypeTags,
} from '../types';
import {
    buildFormattedRecipeWithoutImage,
    generateRandomIdString,
    getCompressedImageBlob,
    getFormattedIngredientsOrSteps,
    getFormattedNutritionInfo,
    getFormattedTags,
    submitRecipe,
} from '../utils';
import { Header } from './Header';
import { Footer } from './Footer';
import ThumbnailEditor from './ThumbnailEditor';
import sharedStyles from '../styles/CommonStyles.module.scss';
import styles from '../styles/RecipeSuggestionPage.module.scss';

export const RecipeSuggestionPage = () => {
    const { appStorage, recipesCollection } = useContext(RecipesAndIngredientsContext);
    const [sourceImageBlob, setSourceImageBlob] = useState<Blob | undefined>();
    const [thumbnailImageBlob, setThumbnailImageBlob] = useState<Blob | undefined>();
    const [isThumbnailEditDialogOpen, setIsThumbnailEditDialogOpen] = useState<boolean>(false);
    
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<Inputs>({
        shouldFocusError: false,
        defaultValues: {
            name: '',
            id: '',
            description: '',
            notes: [{ note: '' }],
            ingredients: [{item: '', glutenFreeSub: '', veganSub: '', vegetarianSub: '', subItems: []}],
            steps: [{item: '', glutenFreeSub: '', veganSub: '', vegetarianSub: '', subItems: []}],
            tags: Object.fromEntries([...DIETARY_TAGS, ...DIFFICULTY_TAGS, ...RECIPE_TYPE_TAGS]
                .map((tag) => [tag, false])
            ),
            time: '',
            servingSize: '',
            numServings: '',
            image: undefined,
            nutritionInfo: {
                calories: {
                    original: undefined,
                    glutenFree: undefined,
                    vegan: undefined,
                    vegetarian: undefined,
                },
                proteinG: {
                    original: undefined,
                    glutenFree: undefined,
                    vegan: undefined,
                    vegetarian: undefined,
                },
                fiberG: {
                    original: undefined,
                    glutenFree: undefined,
                    vegan: undefined,
                    vegetarian: undefined,
                },
                fatG: {
                    original: undefined,
                    glutenFree: undefined,
                    vegan: undefined,
                    vegetarian: undefined,
                },
                sodiumMg: {
                    original: undefined,
                    glutenFree: undefined,
                    vegan: undefined,
                    vegetarian: undefined,
                },
                sugarG: {
                    original: undefined,
                    glutenFree: undefined,
                    vegan: undefined,
                    vegetarian: undefined,
                },
            },
        }
    });

    const selectedImageUrl = watch("image");

    useEffect(() => {
        const loadImage = async () => {
            if (selectedImageUrl !== undefined && selectedImageUrl.length > 0) {
                const imageFile = selectedImageUrl?.[0];
                const imageBlob = await getCompressedImageBlob(imageFile, false);
                if (imageBlob !== undefined) {
                    setSourceImageBlob(imageBlob);
                }

                const thumbnailBlob = await getCompressedImageBlob(imageFile, true);
                if (thumbnailBlob !== undefined) {
                    setThumbnailImageBlob(thumbnailBlob);
                }
            }
        }
        loadImage();
    }, [selectedImageUrl, setSourceImageBlob, setThumbnailImageBlob]);
    
    const openDialog = useCallback(() => setIsThumbnailEditDialogOpen(true), [setIsThumbnailEditDialogOpen]);
    const closeDialog = useCallback(() => setIsThumbnailEditDialogOpen(false), [setIsThumbnailEditDialogOpen]);

    const sourceImageUrl = useMemo(() => {
        return sourceImageBlob !== undefined ? URL.createObjectURL(sourceImageBlob) : undefined;
    }, [sourceImageBlob]);
    const thumbnailImageUrl = useMemo(() => {
        return thumbnailImageBlob !== undefined ? URL.createObjectURL(thumbnailImageBlob) : undefined;
    }, [thumbnailImageBlob]);

    const imagePreview = useMemo(() => {
        if (sourceImageUrl !== undefined) {
            return (
                <div className={styles.imagePreviewContainer}>
                    <div className={styles.sourceImageContainer}>
                        <div className={styles.imageLabel}>{`Selected Image:`}</div>
                        <img className={styles.sourceImage} src={sourceImageUrl} />
                    </div>
                    <div className={styles.thumbnailImageContainer}>
                        <div className={styles.imageLabel}>{`Thumbnail:`}</div>
                        {thumbnailImageUrl && <img className={styles.savedThumbnailImage} src={thumbnailImageUrl} />}
                        <button className={styles.editButton} type="button" onClick={openDialog}>
                            {`Edit Thumbnail`}
                        </button>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }, [sourceImageUrl, thumbnailImageUrl]);

    const thumbnailEditor = useMemo(() => {
        if (isThumbnailEditDialogOpen && sourceImageUrl !== undefined) {
            return (
                <ThumbnailEditor
                    sourceImageUrl={sourceImageUrl}
                    setThumbnailImageBlob={setThumbnailImageBlob}
                    closeDialog={closeDialog}
                />
            );
        } else {
            return null;
        }
    }, [isThumbnailEditDialogOpen, sourceImageUrl, setThumbnailImageBlob, closeDialog]);

    const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
        if (recipesCollection === undefined) {
            // TODO Show error message that we can't submit recipe at the moment
            console.log("Cannot access recipe storage, please try again later");
            return;
        }

        const formattedIngredientsWithSubs = getFormattedIngredientsOrSteps(data.ingredients);
        const formattedStepsWithSubs = getFormattedIngredientsOrSteps(data.steps);

        const dietaryOptions: DietarySelection[] = [];
        if (
            formattedIngredientsWithSubs.hasGlutenFreeSub
            || formattedStepsWithSubs.hasGlutenFreeSub
            || data.tags.glutenFree
        ) {
            dietaryOptions.push(DietarySelection.GlutenFree);
        }
        if (formattedIngredientsWithSubs.hasVeganSub || formattedStepsWithSubs.hasVeganSub || data.tags.vegan) {
            dietaryOptions.push(DietarySelection.Vegan);
        }
        if (
            formattedIngredientsWithSubs.hasVegetarianSub
            || formattedStepsWithSubs.hasVegetarianSub
            || data.tags.vegetarian
        ) {
            dietaryOptions.push(DietarySelection.Vegetarian);
        }

        // TODO: validate that recipeId is not already in use
        const recipeId = data.id !== '' ? data.id : generateRandomIdString(18);

        const tags = getFormattedTags(data.tags);
        const nutritionInfo = getFormattedNutritionInfo(data.nutritionInfo, dietaryOptions);
        const recipeWithoutImage = 
            buildFormattedRecipeWithoutImage(
                data,
                formattedIngredientsWithSubs,
                formattedStepsWithSubs,
                dietaryOptions,
                tags,
                nutritionInfo
            );

        const didRecipeSubmissionSucceed =
            await submitRecipe(
                recipeId,
                recipeWithoutImage,
                sourceImageBlob,
                thumbnailImageBlob,
                appStorage,
                recipesCollection
            );

        if (didRecipeSubmissionSucceed) {
            reset();
        }
    }, [appStorage, recipesCollection, sourceImageBlob, thumbnailImageBlob]);

    const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
        control,
        name: 'ingredients',
    });

    const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
        control,
        name: 'steps',
    });

    const { fields: noteFields, append: appendNote, remove: removeNote } = useFieldArray({
        control,
        name: 'notes',
    });

    const recipeSubmitForm = useMemo(() => {
        return (
            <form className={styles.suggestionForm} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.input}>
                    <div className={styles.recipeInputLabel}>
                        {"*Title:"}
                    </div>
                    <input className={styles.longInput} defaultValue="" {...register("name", { required: true })} />
                </div>
                <div className={styles.input}>
                    <div className={styles.recipeInputLabel}>
                        {"Description:"}
                    </div>
                    <input className={styles.longInput} defaultValue="" {...register("description")} />
                </div>
                <div className={styles.input}>
                    <div className={styles.recipeInputLabel}>
                        {"Time:"}
                    </div>
                    <input className={styles.longInput} defaultValue="" {...register("time")} />
                </div>
                <div className={styles.input}>
                    <div className={styles.recipeInputLabel}>
                        {"Recipe Id:"}
                    </div>
                    <input className={styles.longInput} defaultValue="" {...register("id")} />
                </div>
                <div className={styles.input}>
                    <div className={styles.recipeInputLabel}>
                        {"Serving Size:"}
                    </div>
                    <input className={styles.longInput} defaultValue="" {...register("servingSize")} />
                </div>
                <div className={styles.input}>
                    <div className={styles.recipeInputLabel}>
                        {"Number of Servings:"}
                    </div>
                    <input defaultValue="" {...register("numServings")} />
                </div>
                <div className={styles.dynamicInputGroup}>
                    <div className={styles.inputGroupHeaderWithAddButton}>
                        <div className={styles.recipeInputLabel}>
                            {`*Ingredients:`}
                        </div>
                        <button
                            className={styles.addItemButton}
                            type="button" 
                            onClick={() => appendIngredient({
                                item: '',
                                glutenFreeSub: '',
                                veganSub: '',
                                vegetarianSub: '',
                                subItems: [],
                            })}
                        >
                            {`Add Ingredient`}
                        </button>
                    </div>
                    <IngredientsOrStepsList
                        fields={ingredientFields}
                        listType={`ingredients`}
                        control={control}
                        register={register}
                        removeIngredient={removeIngredient}
                    />
                </div>
                <div className={styles.dynamicInputGroup}>
                    <div className={styles.inputGroupHeaderWithAddButton}>
                        <div className={styles.recipeInputLabel}>
                            {`*Steps:`}
                        </div>
                        <button
                            className={styles.addItemButton}
                            type="button"
                            onClick={() => appendStep({
                                item: '',
                                glutenFreeSub: '',
                                veganSub: '',
                                vegetarianSub: '',
                                subItems: [],
                            })}
                        >
                            {`Add Step`}
                        </button>
                    </div>
                    <IngredientsOrStepsList
                        fields={stepFields}
                        listType={`steps`}
                        control={control}
                        register={register}
                        removeIngredient={removeStep}
                    />
                </div>
                <div className={styles.dynamicInputGroup}>
                    <div className={styles.inputGroupHeaderWithAddButton}>
                        <div className={styles.recipeInputLabel}>
                            {`Notes:`}
                        </div>
                        <button
                            className={styles.addItemButton}
                            type="button"
                            onClick={() => appendNote({ note: '' })}
                        >
                            {`Add Note`}
                        </button>
                    </div>
                    {noteFields.map((note, idx) => {
                        return (
                            <div key={note.id} className={styles.inputWithRemoveButton}>
                                <button className={styles.deleteButton} type="button" onClick={() => removeNote(idx)}>
                                    <i className={classNames("material-icons", styles.buttonIcon)}>close</i>
                                </button>
                                <input
                                    className={styles.longInput}
                                    defaultValue=""
                                    {...register(`notes.${idx}.note`)}
                                />
                            </div>
                        );
                    })}
                </div>
                <NutritionItemInputs register={register} />
                <TagCheckboxes register={register}/>
                <div className={styles.dynamicInputGroup}>
                    <div className={styles.input}>
                        <div className={styles.recipeInputLabel}>
                            {"Recipe Image:"}
                        </div>
                        <input className={styles.imageInput} type="file" accept="image/*" {...register("image")} />
                    </div>
                    <div className={styles.thumbnailEditor}>
                        {imagePreview}
                    </div>
                    {thumbnailEditor}
                </div>
                <div className={styles.suggestionButtonGroup}>
                    <button type="button" onClick={() => reset()}>{`Clear Entry`}</button>
                    <button className={styles.submitButton} type="submit">{`Submit`}</button>
                </div>
            </form>
        );
    }, [
        handleSubmit,
        onSubmit,
        ingredientFields,
        stepFields,
        noteFields,
        appendIngredient,
        appendStep,
        appendNote,
        removeIngredient,
        removeStep,
        removeNote,
        control,
        register,
        imagePreview,
        thumbnailEditor
    ]);
  
    return (
        <div className={styles.inputPageTop}>
            <Header isScrollable={false} />
            <main className={classNames(sharedStyles.pageContainer, styles.inputPageContainer)}>
                <SubmitOverlay />
                <div className={styles.inputPageBackground}>
                    <section className={styles.suggestionSection}>
                        <div className={classNames(styles.suggestionContainer, "container")}>
                            <div className="row">
                                <div className="col-12">
                                    <div className={styles.recipeFormContainer}>
                                        <h3>{"Suggest a Recipe"}</h3>
                                        <p>
                                            {"Thank you for your interest in suggesting a recipe! Please fill out the form below to suggest "}
                                            {"a new recipe. The recipes in the Recipes list are curated recipes I personally stand by. "}
                                            {"To keep that true, I will test out any suggested recipes, and if it is something I love and "}
                                            {"will make again, I'll add it to the Recipes list (and credit you, of course)! Otherwise, I "}
                                            {"will hold onto it to add to an upcoming Community Recipes section of the website."}<br/><br/>
                                            {"Clicking the Submit button will open a prompt to copy a formatted representation of your "}
                                            {"submission. Please copy that text and send it as-is to ebinns88@gmail.com. If you want to "}
                                            {"include a specific image for your recipe, please add it as an attachment to the email you "}
                                            {"send. Otherwise I'll try the recipe out as soon as I can and take a photo myself!"}
                                        </p>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className={styles.inputContainer}>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            {recipeSubmitForm}
                                                        </div>
                                                    </div><br/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

const IngredientsOrStepsList = ({
    fields,
    listType,
    control,
    register,
    removeIngredient,
}: {
    fields: FieldArrayWithId<Inputs, "ingredients" | "steps", "id">[],
    listType: 'ingredients' | 'steps',
    control: Control<Inputs, any, Inputs>,
    register: UseFormRegister<Inputs>,
    removeIngredient: UseFieldArrayRemove,
}) => {
    return (
        <div className={styles.ingredientOrStepInputFields}>
            {fields.map((field, index) => {
                return (
                    <div key={field.id} className={styles.ingredientOrStepInputField}>
                        <div className={styles.inputWithRemoveButton}>
                            <button
                                className={styles.deleteButton}
                                type="button"
                                onClick={() => removeIngredient(index)}
                            >
                                <i className={classNames("material-icons", styles.buttonIcon)}>close</i>
                            </button>
                            <input className={styles.longInput} {...register(`${listType}.${index}.item`)} />
                        </div>
                        <div className={styles.ingredientOrStepSubInput}>
                            <div className={styles.substitutionHeader}>
                                {"Gluten-Free Substitution:"}
                            </div>
                            <input className={styles.longInput} {...register(`${listType}.${index}.glutenFreeSub`)} />
                        </div>
                        <div className={styles.ingredientOrStepSubInput}>
                            <div className={styles.substitutionHeader}>
                                {"Vegan Substitution:"}
                            </div>
                            <input className={styles.longInput} {...register(`${listType}.${index}.veganSub`)} />
                        </div>
                        <div className={styles.ingredientOrStepSubInput}>
                            <div className={styles.substitutionHeader}>
                                {"Vegetarian Substitution:"}
                            </div>
                            <input className={styles.longInput} {...register(`${listType}.${index}.vegetarianSub`)} />
                        </div>
                        <div className={styles.ingredientOrStepSubItemsGroup}>
                            <IngredientsOrStepsSubList
                                listType={listType}
                                control={control}
                                register={register}
                                parentIdx={index}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

const IngredientsOrStepsSubList = ({
    listType,
    control,
    register,
    parentIdx,
}: {
    listType: 'ingredients' | 'steps',
    control: Control<Inputs, any, Inputs>,
    register: UseFormRegister<Inputs>,
    parentIdx: number,
}) => {
    const { fields: subItemFields, append: appendSubItem, remove: removeSubItem } = useFieldArray({
        control,
        name: `${listType}.${parentIdx}.subItems`,
    });

    const subIngredientElements = subItemFields.map((field, index) => {
        return (
            <div key={field.id} className={styles.subIngredientOrStepField}>
                <div className={styles.inputWithRemoveButton}>
                    <button className={styles.deleteButton} type="button" onClick={() => removeSubItem(index)}>
                        <i className={classNames("material-icons", styles.buttonIcon)}>close</i>
                    </button>
                    <input
                        className={styles.longInput}
                        {...register(`${listType}.${parentIdx}.subItems.${index}.item`)}
                    />
                </div>
                <div className={styles.ingredientOrStepSubInput}>
                    <div className={styles.substitutionHeader}>
                        {"Gluten-Free Substitution:"}
                    </div>
                    <input
                        className={styles.longInput}
                        {...register(`${listType}.${parentIdx}.subItems.${index}.glutenFreeSub`)}
                    />
                </div>
                <div className={styles.ingredientOrStepSubInput}>
                    <div className={styles.substitutionHeader}>
                        {"Vegan Substitution:"}
                    </div>
                    <input
                        className={styles.longInput}
                        {...register(`${listType}.${parentIdx}.subItems.${index}.veganSub`)}
                    />
                </div>
                <div className={styles.ingredientOrStepSubInput}>
                    <div className={styles.substitutionHeader}>
                        {"Vegetarian Substitution:"}
                    </div>
                    <input
                        className={styles.longInput}
                        {...register(`${listType}.${parentIdx}.subItems.${index}.vegetarianSub`)}
                    />
                </div>
            </div>
        );
    });

    return (
        <div>
            <button
                className={classNames(styles.addItemButton, styles.addSubItemButton)}
                type="button"
                onClick={() => appendSubItem({
                    item: '',
                    glutenFreeSub: '',
                    veganSub: '',
                    vegetarianSub: '',
                })}
            >
                {`Add Sub-${listType === 'ingredients' ? 'Ingredient' : 'Step'}`}
            </button>
            <div className={styles.subIngredientOrStepFields}>
                {subIngredientElements}
            </div>
        </div>
    )
}

const NutritionItemInputs = ({
    register,
}: {
    register: UseFormRegister<Inputs>,
}) => {
    return (
        <div className={styles.dynamicInputGroup}>
            <div className={styles.recipeInputLabel}>
                {`Nutrition Info:`}
            </div>
            {
                NUTRITION_ITEMS.map((listType) => {
                    return (
                        <div className={styles.nutritionItemInput}>
                            <div className={styles.nutritionItemLabel}>
                                {`${NutritionItemLabelText.get(listType as NutritionItemTypes)}:`}
                            </div>
                            <div className={styles.nutritionItemInputFields}>
                                <div className={styles.nutritionItemSubInput}>
                                    <div>{`Original Recipe`}</div>
                                    <input type="number" {...register(`nutritionInfo.${listType}.original`)} />
                                </div>
                                <div className={styles.nutritionItemSubInput}>
                                    <div>{`Gluten-Free`}</div>
                                    <input type="number" {...register(`nutritionInfo.${listType}.glutenFree`)} />
                                </div>
                                <div className={styles.nutritionItemSubInput}>
                                    <div>{`Vegan`}</div>
                                    <input type="number" {...register(`nutritionInfo.${listType}.vegan`)} />
                                </div>
                                <div className={styles.nutritionItemSubInput}>
                                    <div>{`Vegetarian`}</div>
                                    <input type="number" {...register(`nutritionInfo.${listType}.vegetarian`)} />
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}

const TagCheckboxes = ({
    register,
}: {
    register: UseFormRegister<Inputs>,
}) => {
    return (
        <div className={styles.dynamicInputGroup}>
            <div className={styles.recipeInputLabel}>
                {`Tags:`}
            </div>
            {DIETARY_TAGS.map((tag) => {
                return (
                    <div className={styles.tagInput}>
                        <input type="checkbox" {...register(`tags.${tag}`)} />
                        <div>{DietarySelectionButtonText.get(tag as DietarySelection)}</div>
                    </div>
                )
            })}
            {DIFFICULTY_TAGS.map((tag) => {
                return (
                    <div className={styles.tagInput}>
                        <input type="checkbox" {...register(`tags.${tag}`)} />
                        <div>{DifficultyTagLabelsMap.get(tag as DifficultyTags)}</div>
                    </div>
                )
            })}
            {RECIPE_TYPE_TAGS.map((tag) => {
                return (
                    <div className={styles.tagInput}>
                        <input type="checkbox" {...register(`tags.${tag}`)} />
                        <div>{RecipeTypeTagLabelsMap.get(tag as RecipeTypeTags)}</div>
                    </div>
                )
            })}
        </div>
    );
}

// TODO: show submit overlay on successful submit
const SubmitOverlay = () => {
    return (
        <div className={styles.submitOverlay} id={"submit-overlay"}>
            <div className={styles.submitOverlayContent}>
                <div>
                    <h4>{"Thank you for your submission!"}</h4>
                </div>
            </div>
        </div>
    );
}
