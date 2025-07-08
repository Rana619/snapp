import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConfigStore } from "@/types/store.type"

const initialState: ConfigStore = {
    theme: "light",
    rememberedEmail: ""
};

const configSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        setConfig: (state, action: PayloadAction<ConfigStore>) => action.payload,
        updateConfig: (state, action: PayloadAction<Partial<ConfigStore>>) => ({
            ...state,
            ...(action.payload)
        }),
        resetConfig: () => initialState,
    },
});

export default configSlice.reducer;
export const { setConfig, updateConfig, resetConfig } = configSlice.actions;