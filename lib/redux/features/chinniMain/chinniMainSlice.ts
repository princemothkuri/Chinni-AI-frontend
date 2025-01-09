import { Message } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setSeconds } from "date-fns";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  image: string;
}

interface chinniMainState {
  authToken: string;
  isLoggedIn: boolean;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  image: string;
  chatHistory: Message[];
  isSpeakerOn: boolean;
}

const initialState: chinniMainState = {
  authToken: "",
  isLoggedIn: false,
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  image: "",
  chatHistory: [],
  isSpeakerOn: false,
};

export const chinniMainSlice = createSlice({
  name: "ChinniMain",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
      state.isLoggedIn = true;
    },
    setProfile: (state, action: PayloadAction<ProfileData>) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.image = action.payload.image;
    },
    setChatHistory: (state, action: PayloadAction<Message>) => {
      state.chatHistory = [...state.chatHistory, action.payload];
    },
    clearChatHistory: (state) => {
      state.chatHistory = [];
    },
    setSpeaker: (state, action: PayloadAction<boolean>) => {
      state.isSpeakerOn = action.payload;
    },
    chinniMainSliceReset: () => initialState,
  },
});

export const {
  setToken,
  setProfile,
  setChatHistory,
  clearChatHistory,
  setSpeaker,
  chinniMainSliceReset,
} = chinniMainSlice.actions;

export default chinniMainSlice.reducer;
