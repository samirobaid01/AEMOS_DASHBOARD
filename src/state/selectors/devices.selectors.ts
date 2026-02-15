import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { Device } from '../../types/device';

const selectDevicesState = (state: RootState) => state.devices;

export const selectAllDevices = createSelector(
  selectDevicesState,
  (devicesState) =>
    devicesState.allIds
      .map((id) => devicesState.byId[id])
      .filter((d): d is Device => d != null)
);

export const selectDeviceById = createSelector(
  [
    selectDevicesState,
    (_state: RootState, id: number | string) => (typeof id === 'string' ? id : String(id)),
  ],
  (devicesState, id) => devicesState.byId[id] ?? null
);

export const selectDevicesByArea = createSelector(
  [selectAllDevices, (_state: RootState, areaId: number) => areaId],
  (devices, areaId) => devices.filter((d) => d.areaId === areaId)
);

export const selectDevicesByOrganization = createSelector(
  [selectAllDevices, (_state: RootState, organizationId: number) => organizationId],
  (devices, organizationId) => devices.filter((d) => d.organizationId === organizationId)
);
