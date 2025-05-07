import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import organizationsReducer from './slices/organizations.slice';
import areasReducer from './slices/areas.slice';
import sensorsReducer from './slices/sensors.slice';
import devicesReducer from './slices/devices.slice';
// Import other reducers as they are created
// import devicesReducer from './slices/devices.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organizations: organizationsReducer,
    areas: areasReducer,
    sensors: sensorsReducer,
    devices: devicesReducer,
    // Add other reducers as they are created
    // devices: devicesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 