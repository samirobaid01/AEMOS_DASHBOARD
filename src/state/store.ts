import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import organizationsReducer from './slices/organizations.slice';
import areasReducer from './slices/areas.slice';
import sensorsReducer from './slices/sensors.slice';
import devicesReducer from './slices/devices.slice';
import deviceStatesReducer from './slices/deviceStates.slice';
import deviceDetailsReducer from './slices/deviceDetails.slice';
// Import other reducers as they are created
// import devicesReducer from './slices/devices.slice';

// Define the root reducer type first
const rootReducer = {
  auth: authReducer,
  organizations: organizationsReducer,
  areas: areasReducer,
  sensors: sensorsReducer,
  devices: devicesReducer,
  deviceStates: deviceStatesReducer,
  deviceDetails: deviceDetailsReducer,
  // Add other reducers as they are created
  // devices: devicesReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Define RootState using reducer type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 