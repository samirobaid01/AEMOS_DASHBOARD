import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, ArrowLeft, Pencil, Trash2, AlertCircle, Plus } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import { DataTable, type DataTableColumn } from '../../components/common/DataTable';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import type { OrganizationDetailsProps } from './types';

type AreaRow = OrganizationDetailsProps['areas'][number];
type SensorRow = OrganizationDetailsProps['sensors'][number];
type DeviceRow = OrganizationDetailsProps['devices'][number];

const booleanStatusPill = (active: boolean, activeLabel: string, inactiveLabel: string) => (
  <span
    className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${
      active
        ? 'bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark'
        : 'bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark'
    }`}
  >
    <span className={`w-2 h-2 rounded-full mr-1.5 ${active ? 'bg-success dark:bg-success-dark' : 'bg-danger dark:bg-danger-dark'}`} />
    {active ? activeLabel : inactiveLabel}
  </span>
);

const OrganizationDetails: React.FC<OrganizationDetailsProps> = ({
  organization,
  areas,
  devices,
  sensors,
  isLoading: _isLoading,
  error,
  deleteModalOpen,
  isDeleting,
  onBack,
  onDelete,
  onOpenDeleteModal,
  onCloseDeleteModal
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const areaColumns: DataTableColumn<AreaRow>[] = [
    { key: 'name', header: t('areas.name', { defaultValue: 'Name' }), sortValue: (a) => a.name, cell: (a) => <span className="font-medium">{a.name}</span> },
    { key: 'description', header: t('common.description'), sortValue: (a) => a.description ?? '', cell: (a) => <span className="text-textMuted dark:text-textMuted-dark">{a.description || t('areas.noDescription')}</span> },
    { key: 'status', header: t('status'), align: 'right', sortValue: (a) => (a.status ? 1 : 0), cell: (a) => booleanStatusPill(!!a.status, t('active'), t('inactive')) },
  ];

  const sensorColumns: DataTableColumn<SensorRow>[] = [
    { key: 'name', header: t('sensors.name', { defaultValue: 'Name' }), sortValue: (s) => s.name, cell: (s) => <span className="font-medium">{s.name}</span> },
    { key: 'uuid', header: t('sensors.uuid', { defaultValue: 'UUID' }), sortValue: (s) => s.uuid ?? '', cell: (s) => <span className="text-textMuted dark:text-textMuted-dark">{s.uuid || '—'}</span> },
    { key: 'status', header: t('status'), align: 'right', sortValue: (s) => (s.status ? 1 : 0), cell: (s) => booleanStatusPill(!!s.status, t('active'), t('inactive')) },
  ];

  const deviceColumns: DataTableColumn<DeviceRow>[] = [
    { key: 'name', header: t('devices.name', { defaultValue: 'Name' }), sortValue: (d) => d.name, cell: (d) => <span className="font-medium">{d.name}</span> },
    { key: 'uuid', header: t('devices.uuid', { defaultValue: 'UUID' }), sortValue: (d) => d.uuid ?? '', cell: (d) => <span className="text-textMuted dark:text-textMuted-dark">{d.uuid || '—'}</span> },
    { key: 'status', header: t('status'), align: 'right', sortValue: (d) => (d.status === 'active' ? 1 : 0), cell: (d) => booleanStatusPill(d.status === 'active', t('active'), t('inactive')) },
  ];

  const badgeClass =
    organization?.status === 'active'
      ? 'bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark'
      : organization?.status === 'inactive'
        ? 'bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark'
        : 'bg-border dark:bg-border-dark text-textSecondary dark:text-textSecondary-dark';

  const dotClass =
    organization?.status === 'active'
      ? 'bg-success dark:bg-success-dark'
      : organization?.status === 'inactive'
        ? 'bg-danger dark:bg-danger-dark'
        : 'bg-textMuted dark:bg-textMuted-dark';

  if (error) {
    return (
      <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
        <div className="w-full">
          <div className="flex items-center gap-2 p-4 rounded-xl bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark text-sm font-medium mb-4">
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden />
            {error}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
        <div className="w-full">
          <div className="flex items-center gap-2 p-4 rounded-xl bg-warningBg dark:bg-warningBg-dark text-warningText dark:text-warningText-dark text-sm font-medium mb-4">
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden />
            {t('organizations.organization_not_found')}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="self-start"
          >
            {t('common.back')}
          </Button>

          <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
                <Building2 className="w-6 h-6" aria-hidden />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0 truncate">
                  {organization.name}
                </h1>
                <div className="flex items-center flex-wrap gap-2 mt-1.5">
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">
                    {organization.isParent ? t('organizations.parentOrganization') : t('organizations.childOrganization')}
                  </span>
                  <span className={`inline-flex items-center py-0.5 px-2 rounded-full text-xs font-medium ${badgeClass}`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${dotClass}`} />
                    {t(organization.status)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link to={`/organizations/${organization.id}/edit`}>
                <Button type="button" variant="primary" leftIcon={<Pencil className="w-4 h-4" />}>
                  {t('common.edit')}
                </Button>
              </Link>
              <Button type="button" variant="danger" onClick={onOpenDeleteModal} leftIcon={<Trash2 className="w-4 h-4" />}>
                {t('common.delete')}
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-border dark:border-border-dark">
            <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark mb-4">{t('organizations.detail')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="mb-3">
                <div className="text-sm font-medium text-textMuted dark:text-textMuted-dark mb-1">{t('status')}</div>
                <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium ${badgeClass}`}>
                  <span className={`w-2 h-2 rounded-full mr-1.5 ${dotClass}`} />
                  {t(organization.status)}
                </span>
              </div>
              <div className="mb-3">
                <div className="text-sm font-medium text-textMuted dark:text-textMuted-dark mb-1">{t('organizations.organizationType')}</div>
                <div className="text-base text-textPrimary dark:text-textPrimary-dark">
                  {organization.isParent ? t('organizations.parentOrganization') : t('organizations.childOrganization')}
                </div>
              </div>
              {organization.email && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-textMuted dark:text-textMuted-dark mb-1">{t('organizations.email')}</div>
                  <div className="text-base text-textPrimary dark:text-textPrimary-dark">{organization.email}</div>
                </div>
              )}
              {organization.contactNumber && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-textMuted dark:text-textMuted-dark mb-1">{t('organizations.contactNumber')}</div>
                  <div className="text-base text-textPrimary dark:text-textPrimary-dark">{organization.contactNumber}</div>
                </div>
              )}

              {organization.address && (
                <div className="mb-3 col-span-full">
                  <div className="text-sm font-medium text-textMuted dark:text-textMuted-dark mb-1">{t('organizations.address')}</div>
                  <div className="text-base text-textPrimary dark:text-textPrimary-dark">
                    {organization.address}
                    {organization.zip && `, ${organization.zip}`}
                  </div>
                </div>
              )}
              {organization.detail && (
                <div className="mb-3 col-span-full">
                  <div className="text-sm font-medium text-textMuted dark:text-textMuted-dark mb-1">{t('common.description')}</div>
                  <div className="text-base text-textPrimary dark:text-textPrimary-dark">{organization.detail}</div>
                </div>
              )}
            </div>
          </div>

          <CollapsibleSection
            className="p-6 border-b border-border dark:border-border-dark"
            title={t('areas.title')}
            count={areas.length}
            action={
              <Link to={`/areas/create?organizationId=${organization.id}`}>
                <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>{t('areas.add')}</Button>
              </Link>
            }
          >
            <DataTable
              columns={areaColumns}
              data={areas}
              getRowId={(a) => a.id}
              onRowClick={(a) => navigate(`/areas/${a.id}`)}
              searchable
              getSearchText={(a) => `${a.name} ${a.description ?? ''}`}
              searchPlaceholder={t('areas.search', { defaultValue: 'Search areas…' })}
              emptyMessage={t('no_areas')}
            />
          </CollapsibleSection>

          <CollapsibleSection
            className="p-6 border-b border-border dark:border-border-dark"
            title={t('sensors.title')}
            count={sensors.length}
            action={
              <Link to={`/sensors/create?organizationId=${organization.id}`}>
                <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>{t('sensors.add')}</Button>
              </Link>
            }
          >
            <DataTable
              columns={sensorColumns}
              data={sensors}
              getRowId={(s) => s.id}
              onRowClick={(s) => navigate(`/sensors/${s.id}`)}
              searchable
              getSearchText={(s) => `${s.name} ${s.uuid ?? ''}`}
              searchPlaceholder={t('sensors.search', { defaultValue: 'Search sensors…' })}
              emptyMessage={t('no_sensors')}
            />
          </CollapsibleSection>

          <CollapsibleSection
            className="p-6"
            title={t('devices.title')}
            count={devices.length}
            action={
              <Link to={`/devices/create?organizationId=${organization.id}`}>
                <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>{t('devices.add')}</Button>
              </Link>
            }
          >
            <DataTable
              columns={deviceColumns}
              data={devices}
              getRowId={(d) => d.id}
              onRowClick={(d) => navigate(`/devices/${d.id}`)}
              searchable
              getSearchText={(d) => `${d.name} ${d.uuid ?? ''}`}
              searchPlaceholder={t('devices.search', { defaultValue: 'Search devices…' })}
              emptyMessage={t('no_devices')}
            />
          </CollapsibleSection>
        </div>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card dark:bg-card-dark rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dangerBg dark:bg-dangerBg-dark text-danger dark:text-danger-dark mr-4 flex-shrink-0">
                  <AlertCircle className="w-6 h-6" aria-hidden />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark">{t('organizations.delete')}</h3>
                  <p className="mt-2 text-sm text-textSecondary dark:text-textSecondary-dark">
                    {t('organizations.delete_organization_confirm', { name: organization.name })}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-surfaceHover dark:bg-surfaceHover-dark flex justify-end gap-3 rounded-b-xl">
              <Button type="button" variant="danger" isLoading={isDeleting} disabled={isDeleting} onClick={onDelete} leftIcon={<Trash2 className="w-4 h-4" />}>
                {t('common.delete')}
              </Button>
              <Button type="button" variant="secondary" onClick={onCloseDeleteModal}>
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationDetails;
