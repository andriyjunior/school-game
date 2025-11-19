import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, GameType } from '../../types';

const initialState: UIState = {
  showNameModal: true,
  showHelp: false,
  helpGameType: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowNameModal: (state, action: PayloadAction<boolean>) => {
      state.showNameModal = action.payload;
    },
    setShowHelp: (state, action: PayloadAction<boolean>) => {
      state.showHelp = action.payload;
    },
    setHelpGameType: (state, action: PayloadAction<GameType | ''>) => {
      state.helpGameType = action.payload;
    },
    openHelp: (state, action: PayloadAction<GameType>) => {
      state.showHelp = true;
      state.helpGameType = action.payload;
    },
    closeHelp: (state) => {
      state.showHelp = false;
      state.helpGameType = '';
    },
  },
});

export const {
  setShowNameModal,
  setShowHelp,
  setHelpGameType,
  openHelp,
  closeHelp,
} = uiSlice.actions;

export default uiSlice.reducer;
