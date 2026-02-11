import { configureStore } from '@reduxjs/toolkit';
import type { ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/auth.slice';
import organizationsReducer from './slices/organizations.slice';
import areasReducer from './slices/areas.slice';
import sensorsReducer from './slices/sensors.slice';
import devicesReducer from './slices/devices.slice';
import deviceStatesReducer from './slices/deviceStates.slice';
import deviceDetailsReducer from './slices/deviceDetails.slice';
import deviceStateInstancesReducer from './slices/deviceStateInstances.slice';
import ruleEngineReducer from './slices/ruleEngine.slice';
// Import other reducers as they are created
// import devicesReducer from './slices/devices.slice';

const rootReducer = {
  auth: authReducer,
  organizations: organizationsReducer,
  areas: areasReducer,
  sensors: sensorsReducer,
  devices: devicesReducer,
  deviceStates: deviceStatesReducer,
  deviceDetails: deviceDetailsReducer,
  deviceStateInstances: deviceStateInstancesReducer,
  ruleEngine: ruleEngineReducer,
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 