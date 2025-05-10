import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredients/slice';
import { Modal } from '../modal';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector(selectIngredients);
  const navigate = useNavigate();

  const handleModalClose = () => navigate(-1);

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <Modal title={'Детали ингредиента'} onClose={() => handleModalClose()}>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </Modal>
  );
};
