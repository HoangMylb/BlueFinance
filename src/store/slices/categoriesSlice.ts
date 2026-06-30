import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';
import { initialCategories } from '../../data/demoData';

interface CategoriesState {
  list: Category[];
}

const loadState = (): CategoriesState => {
  try {
    const serialized = localStorage.getItem('bluefinance_categories');
    if (serialized === null) {
      return { list: initialCategories };
    }
    return JSON.parse(serialized);
  } catch (err) {
    return { list: initialCategories };
  }
};

const initialState: CategoriesState = loadState();

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Omit<Category, 'id'>>) => {
      const newCategory: Category = {
        ...action.payload,
        id: `c-${Date.now()}`
      };
      state.list.push(newCategory);
      localStorage.setItem('bluefinance_categories', JSON.stringify(state));
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.list.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        localStorage.setItem('bluefinance_categories', JSON.stringify(state));
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(c => c.id !== action.payload);
      localStorage.setItem('bluefinance_categories', JSON.stringify(state));
    },
    resetCategories: (state) => {
      state.list = initialCategories;
      localStorage.setItem('bluefinance_categories', JSON.stringify({ list: initialCategories }));
    }
  }
});

export const { addCategory, updateCategory, deleteCategory, resetCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
