import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../state/store";
import {
  fetchDeviceDetails,
  selectDeviceDetails,
  selectDeviceDetailsLoading,
  selectDeviceDetailsError,
  clearDeviceDetails,
  updateDeviceStateLocally,
} from "../../state/slices/deviceDetails.slice";
import { createDeviceStateInstance } from "../../state/slices/deviceStateInstances.slice";
import { selectSelectedOrganization } from "../../state/slices/organizations.slice";
import { selectSelectedOrganizationId } from "../../state/slices/auth.slice";
import {
  fetchAreaById,
  selectSelectedArea,
} from "../../state/slices/areas.slice";
import { deleteDevice } from "../../state/slices/devices.slice";
import type { Device } from "../../types/device";
import DeviceDetailsComponent from "../../components/devices/DeviceDetails";
import type { DeviceStateNotification } from "../../hooks/useDeviceStateSocket";
import { useDeviceStateSocket } from "../../hooks/useDeviceStateSocket";
import { API_URL } from "../../config";

interface SelectedState {
  id: number;
  name: string;
  value: string;
  defaultValue: string;
  allowedValues: string[];
}

interface DeviceState {
  stateName: string;
  // ... other properties of DeviceState if any
}

const DeviceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const device = useAppSelector(selectDeviceDetails);
  const organization = useAppSelector(selectSelectedOrganization);
  const organizationId = useAppSelector(selectSelectedOrganizationId);
  const authToken = useAppSelector((state) => state.auth.token) || "";
  const area = useAppSelector(selectSelectedArea);
  const isLoading = useAppSelector(selectDeviceDetailsLoading);
  const error = useAppSelector(selectDeviceDetailsError);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedState, setSelectedState] = useState<SelectedState | null>(
    null
  );
  const [isStateUpdating, setIsStateUpdating] = useState(false);

  const isComponentMounted = useRef(true);

  // Set mounted flag
  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  // Handle notifications
  const handleNotification = useCallback(
    (notification: DeviceStateNotification) => {
      // Return early if component is unmounting or no device
      if (!device?.uuid || !notification.metadata) return;

      // Check if the notification is for this device
      if (notification.metadata.deviceUuid !== device.uuid) {
        return;
      }

      console.log("[DeviceDetails] Received notification:", {
        deviceUuid: notification.metadata.deviceUuid,
        currentDeviceUuid: device.uuid,
        stateName: notification.metadata.stateName,
        newValue: notification.metadata.newValue,
      });

      const state = device.states.find(
        (s: DeviceState) => s.stateName === notification.metadata.stateName
      );
      if (!state) return;

      dispatch(
        updateDeviceStateLocally({
          stateId: state.id,
          value: notification.metadata.newValue,
        })
      );
    },
    [device, dispatch]
  );

  // Use the optimized socket hook
  const {
    isConnected,
    lastError: socketError,
    connect,
    joinDeviceUuidRoom,
    disconnect,
  } = useDeviceStateSocket({
    serverUrl: API_URL.replace("/api/v1/", ""),
    authToken,
    deviceUuid: device?.uuid || "",
    onNotification: handleNotification,
    onConnectionChange: (connected) => {
      console.log("[DeviceDetails] Socket connection status:", connected);
    },
  });

  // Main cleanup effect
  useEffect(() => {
    return () => {
      console.log("[DeviceDetails] Component unmounting - cleaning up socket");
      disconnect();
    };
  }, []); // Empty dependency array to run only on unmount

  // Handle socket connection
  useEffect(() => {
    if (!authToken || !device?.uuid) return;

    const deviceUuid = device.uuid;
    const currentAuthToken = authToken;

    console.log("[DeviceDetails] Initializing socket connection");
    connect();

    if (isConnected) {
      console.log("[DeviceDetails] Joining device UUID room:", deviceUuid);
      joinDeviceUuidRoom(deviceUuid);
    }

    return () => {
      // Cleanup if auth token or device changes
      if (deviceUuid !== device?.uuid || currentAuthToken !== authToken) {
        console.log("[DeviceDetails] Auth/Device changed - cleaning up socket");
        disconnect();
      }
    };
  }, [authToken, device?.uuid, isConnected]);

  useEffect(() => {
    if (id && organizationId) {
      dispatch(
        fetchDeviceDetails({
          deviceId: parseInt(id, 10),
          organizationId,
        })
      );
    }

    return () => {
      dispatch(clearDeviceDetails());
    };
  }, [dispatch, id, organizationId]);

  useEffect(() => {
    if (device?.areaId) {
      dispatch(fetchAreaById(device.areaId));
    }
  }, [dispatch, device?.areaId]);

  const handleStateButtonClick = (state: any) => {
    setSelectedState({
      id: state.id,
      name: state.stateName,
      value: state.instances[0]?.value || state.defaultValue,
      defaultValue: state.defaultValue,
      allowedValues: JSON.parse(state.allowedValues),
    });
  };

  const handleStateModalClose = () => {
    setSelectedState(null);
  };

  const handleStateModalSave = async (value: string) => {
    if (!selectedState || !device?.uuid) return;

    setIsStateUpdating(true);
    try {
      await dispatch(
        createDeviceStateInstance({
          deviceUuid: device.uuid,
          stateName: selectedState.name,
          value,
          initiatedBy: "user",
        })
      ).unwrap();

      setSelectedState(null);
    } catch (error) {
      console.error("Error updating device state:", error);
    } finally {
      setIsStateUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteDevice(parseInt(id, 10))).unwrap();
      // if (organizationId) {
      //   navigate(`/organizations/${organizationId}/devices`);
      // } else {
      navigate("/devices");
      // }
    } catch (error) {
      console.error("Error deleting device:", error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleNavigateBack = () => {
    if (organizationId) {
      navigate(`/organizations/${organizationId}/devices`);
    } else {
      navigate("/devices");
    }
  };

  return (
    <DeviceDetailsComponent
      device={device as Device | null}
      organization={organization}
      area={area}
      isLoading={isLoading}
      error={error}
      isDeleting={isDeleting}
      deleteModalOpen={deleteModalOpen}
      onDelete={handleDelete}
      onOpenDeleteModal={() => setDeleteModalOpen(true)}
      onCloseDeleteModal={() => setDeleteModalOpen(false)}
      onNavigateBack={handleNavigateBack}
      onStateButtonClick={handleStateButtonClick}
      selectedState={selectedState}
      onStateModalClose={handleStateModalClose}
      onStateModalSave={handleStateModalSave}
      isStateUpdating={isStateUpdating}
      isSocketConnected={isConnected}
      socketError={socketError}
    />
  );
};

export default DeviceDetails;
