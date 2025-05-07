import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../state/store';
import { selectOrganizations, fetchOrganizations } from '../../state/slices/organizations.slice';
import { selectAreas, fetchAreas } from '../../state/slices/areas.slice';
import { selectSensors, fetchSensors } from '../../state/slices/sensors.slice';
import { selectDevices, fetchDevices } from '../../state/slices/devices.slice';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';

// Import our reusable components
import StatCard from '../../components/dashboard/StatCard';
import EntityList from '../../components/dashboard/EntityList';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  const organizations = useSelector(selectOrganizations);
  const areas = useSelector(selectAreas);
  const sensors = useSelector(selectSensors);
  const devices = useSelector(selectDevices);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchOrganizations()),
          dispatch(fetchAreas()),
          dispatch(fetchSensors()),
          dispatch(fetchDevices())
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  const stats = [
    { 
      name: t('organizations'), 
      count: organizations.length, 
      path: '/organizations', 
      icon: '🚜', 
      color: 'bg-leaf-600', 
      textColor: 'text-leaf-800', 
      bgColor: 'bg-leaf-50', 
      borderColor: 'border-leaf-200' 
    },
    { 
      name: t('areas'), 
      count: areas.length, 
      path: '/areas', 
      icon: '🌾', 
      color: 'bg-soil-600', 
      textColor: 'text-soil-800', 
      bgColor: 'bg-soil-50', 
      borderColor: 'border-soil-200' 
    },
    { 
      name: t('sensors'), 
      count: sensors.length, 
      path: '/sensors', 
      icon: '🌡️', 
      color: 'bg-wheat-600', 
      textColor: 'text-wheat-800', 
      bgColor: 'bg-wheat-50', 
      borderColor: 'border-wheat-200' 
    },
    { 
      name: t('devices'), 
      count: devices.length, 
      path: '/devices', 
      icon: '📡', 
      color: 'bg-sky-600', 
      textColor: 'text-sky-800', 
      bgColor: 'bg-sky-50', 
      borderColor: 'border-sky-200' 
    }
  ];

  return (
    <>
      <DashboardHeader title="dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <StatCard
            key={stat.name}
            name={stat.name}
            count={stat.count}
            path={stat.path}
            icon={stat.icon}
            color={stat.color}
            textColor={stat.textColor}
            bgColor={stat.bgColor}
            borderColor={stat.borderColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        <EntityList
          title={t('recent_organizations')}
          titleIcon="🚜"
          entities={organizations}
          entityIcon="🚜"
          emptyMessage={t('no_organizations')}
          basePath="/organizations"
          createPath="/organizations/create"
          detailField="detail"
          headerColor="bg-leaf-600"
          hoverColor="bg-leaf-50"
          dividerColor="divide-leaf-100"
          buttonColor="text-leaf-600"
          buttonHoverColor="text-leaf-700"
        />

        <EntityList
          title={t('recent_devices')}
          titleIcon="📡"
          entities={devices}
          entityIcon="📡"
          emptyMessage={t('no_devices')}
          basePath="/devices"
          createPath="/devices/create"
          detailField="serialNumber"
          headerColor="bg-sky-600"
          hoverColor="bg-sky-50"
          dividerColor="divide-sky-100"
          buttonColor="text-sky-600"
          buttonHoverColor="text-sky-700"
        />
      </div>
    </>
  );
};

export default Dashboard; 