import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import chinniMainReducer from "@/lib/redux/features/chinniMain/chinniMainSlice";
import dashboardReducer from "@/lib/redux/features/dashboard/dashboardSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  chinniMain: chinniMainReducer,
  dashBoard: dashboardReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Single shared store instance
const store = configureStore({
  reducer: persistedReducer,
});

// Persistor tied to the shared store instance
const persistor = persistStore(store);

export { store, persistor };
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
