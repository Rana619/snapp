import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserStore } from "@/types/store.type";

const initialState: UserStore = {
    authToken: "",
    user: {
        name: "",
        email: "",
        roles: []
    }
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserStore>) => action.payload,
        resetUser: () => initialState,
    },
});

export default userSlice.reducer;
export const { setUser, resetUser } = userSlice.actions;