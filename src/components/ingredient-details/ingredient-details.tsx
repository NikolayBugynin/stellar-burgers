import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Preloader } from '../ui/preloader';

export const IngredientDetails: FC = () => {
  const { id } = useParams();

  const ingredients = useSelector(selectIngredients);

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
