import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Member = {
    memberPk: number;
    memberName?: string;
}

type AuthState = {
    isLoggedIn: boolean;
    member: Member |  null;
    checked: boolean;
}

const initialState: AuthState = {
    isLoggedIn: false,
    member: null,
    checked: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<Member>) {
            state.isLoggedIn = true;
            state.member = action.payload;
            state.checked = true;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.member = null;
            state.checked = true;
        },
        authChecked(state) {
            state.checked = true;
        }
    }
})

export const { loginSuccess, logout, authChecked } = authSlice.actions;
export default authSlice.reducer;

