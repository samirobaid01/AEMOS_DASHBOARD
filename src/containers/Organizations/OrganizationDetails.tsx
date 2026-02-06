import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../state/store';
import {
  fetchOrganizationById,
  selectSelectedOrganization,
  selectOrganizationsLoading,
  selectOrganizationsError,
  deleteOrganization
} from '../../state/slices/organizations.slice';
import { fetchAreasByOrganizationId, selectAreas } from '../../state/slices/areas.slice';
import { fetchDevicesByOrganizationId, selectDevices } from '../../state/slices/devices.slice';
import { fetchSensorsByOrganizationId, selectSensors } from '../../state/slices/sensors.slice';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import { OrganizationDetails as OrganizationDetailsComponent } from '../../components/organizations';

const OrganizationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const organization = useSelector(selectSelectedOrganization);
  const areas = useSelector(selectAreas);
  const devices = useSelector(selectDevices);
  const sensors = useSelector(selectSensors);
  const isLoading = useSelector(selectOrganizationsLoading);
  const error = useSelector(selectOrganizationsError);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const orgId = parseInt(id, 10);
      dispatch(fetchOrganizationById(orgId));
      dispatch(fetchAreasByOrganizationId(orgId));
      dispatch(fetchDevicesByOrganizationId(orgId));
      dispatch(fetchSensorsByOrganizationId(orgId));
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const resultAction = await dispatch(deleteOrganization(parseInt(id, 10)));
      if (deleteOrganization.fulfilled.match(resultAction)) {
        navigate('/organizations');
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleBack = () => {
    navigate('/organizations');
  };

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  if (isLoading && !organization) {
    return <LoadingScreen />;
  }

  return (
    <OrganizationDetailsComponent
      organization={organization}
      areas={areas}
      devices={devices}
      sensors={sensors}
      isLoading={isLoading}
      error={error}
      deleteModalOpen={deleteModalOpen}
      isDeleting={isDeleting}
      onBack={handleBack}
      onDelete={handleDelete}
      onOpenDeleteModal={handleOpenDeleteModal}
      onCloseDeleteModal={handleCloseDeleteModal}
    />
  );
};

export default OrganizationDetails; 