import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { selectOrganizations, fetchOrganizations } from '../../state/slices/organizations.slice';
import { selectAreas, fetchAreas } from '../../state/slices/areas.slice';
import { selectSensors, fetchSensors } from '../../state/slices/sensors.slice';
import { selectDevices, fetchDevices } from '../../state/slices/devices.slice';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card/Card';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import Page from '../../components/common/Page/Page';
import StatCard from '../../components/dashboard/StatCard';
import EntityList, { type Entity } from '../../components/dashboard/EntityList';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardWalkthrough from '../../components/dashboard/DashboardWalkthrough';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const organizations = useAppSelector(selectOrganizations);
  const areas = useAppSelector(selectAreas);
  const sensors = useAppSelector(selectSensors);
  const devices = useAppSelector(selectDevices);

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
    { name: t('common.organizations'), count: organizations.length, path: '/organizations', icon: '🚜', color: 'bg-leaf-600', textColor: 'text-leaf-800', bgColor: 'bg-leaf-50', borderColor: 'border-leaf-200' },
    { name: t('common.areas'), count: areas.length, path: '/areas', icon: '🌾', color: 'bg-soil-600', textColor: 'text-soil-800', bgColor: 'bg-soil-50', borderColor: 'border-soil-200' },
    { name: t('common.sensors'), count: sensors.length, path: '/sensors', icon: '🌡️', color: 'bg-wheat-600', textColor: 'text-wheat-800', bgColor: 'bg-wheat-50', borderColor: 'border-wheat-200' },
    { name: t('common.devices'), count: devices.length, path: '/devices', icon: '📡', color: 'bg-sky-600', textColor: 'text-sky-800', bgColor: 'bg-sky-50', borderColor: 'border-sky-200' }
  ];

  return (
    <Page className="bg-background dark:bg-background-dark min-h-[calc(100vh-60px)] text-textPrimary dark:text-textPrimary-dark">
      <DashboardHeader title={t('dashboard.title')} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-6">
        <Card contentClassName="p-0">
          <EntityList
            title={t('dashboard.recent_organizations')}
            titleIcon="🚜"
            entities={organizations as unknown as Entity[]}
            entityIcon="🚜"
            emptyMessage={t('dashboard.no_organizations')}
            basePath="/organizations"
            createPath="/organizations/create"
            detailField="detail"
            headerColor="bg-leaf-600"
            hoverColor="bg-leaf-50"
            dividerColor="divide-leaf-100"
            buttonColor="text-leaf-600"
            buttonHoverColor="text-leaf-700"
            addNewText={t('common.add_new')}
            viewAllText={t('common.view_all')}
            createNewText={t('common.create_new')}
            noDetailsText={t('common.no_details')}
          />
        </Card>
        <Card contentClassName="p-0">
          <EntityList
            title={t('dashboard.recent_devices')}
            titleIcon="📡"
            entities={devices as unknown as Entity[]}
            entityIcon="📡"
            emptyMessage={t('dashboard.no_devices')}
            basePath="/devices"
            createPath="/devices/create"
            detailField="serialNumber"
            headerColor="bg-sky-600"
            hoverColor="bg-sky-50"
            dividerColor="divide-sky-100"
            buttonColor="text-sky-600"
            buttonHoverColor="text-sky-700"
            addNewText={t('common.add_new')}
            viewAllText={t('common.view_all')}
            createNewText={t('common.create_new')}
            noDetailsText={t('common.no_details')}
          />
        </Card>
      </div>

      <DashboardWalkthrough />
    </Page>
  );
};

export default Dashboard;
