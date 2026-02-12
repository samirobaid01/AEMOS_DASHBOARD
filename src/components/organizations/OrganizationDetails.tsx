import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Organization } from '../../types/organization';
import type { Area } from '../../types/area';
import type { Device } from '../../types/device';
import Button from '../../components/common/Button/Button';
import type { Sensor } from '../../types/sensor';

interface OrganizationDetailsProps {
  organization: Organization | null;
  areas: Area[];
  devices: Device[];
  sensors: Sensor[];
  isLoading: boolean;
  error: string | null;
  deleteModalOpen: boolean;
  isDeleting: boolean;
  onBack: () => void;
  onDelete: () => void;
  onOpenDeleteModal: () => void;
  onCloseDeleteModal: () => void;
}

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

  const badgeClass =
    organization?.status === 'active'
      ? 'bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark'
      : organization?.status === 'inactive'
        ? 'bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark'
        : 'bg-border dark:bg-border-dark text-textSecondary dark:text-textSecondary-dark';

  if (error) {
    return (
      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-4 rounded-lg mb-4">
            <h3 className="font-medium">{error}</h3>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={onBack}>
              {t('organizations.backToOrganizations')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="bg-warningBg dark:bg-warningBg-dark text-warningText dark:text-warningText-dark p-4 rounded-lg mb-4">
            <h3 className="font-medium">{t('organizations.organization_not_found')}</h3>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={onBack}>
              {t('organizations.backToOrganizations')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark">{organization.name}</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack}>
              {t('common.back')}
            </Button>
            <Link to={`/organizations/${organization.id}/edit`}>
              <Button variant="primary">{t('common.edit')}</Button>
            </Link>
            <Button variant="danger" onClick={onOpenDeleteModal}>
              {t('common.delete')}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-border dark:border-border-dark">
            <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark mb-4">{t('organizations.detail')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="mb-3">
                <div className="text-sm font-medium text-textMuted dark:text-textMuted-dark mb-1">{t('status')}</div>
                <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium ${badgeClass}`}>
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

          <div className="p-6 border-b border-border dark:border-border-dark">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">{t('areas.title')}</h2>
              <Link to={`/areas/create?organizationId=${organization.id}`}>
                <Button variant="outline" size="sm">{t('areas.add')}</Button>
              </Link>
            </div>
            {areas.length > 0 ? (
              <div>
                {areas.map((area) => (
                  <div key={area.id} className="py-3 border-b border-border dark:border-border-dark last:border-0">
                    <Link
                      to={`/areas/${area.id}`}
                      className="flex justify-between items-center p-2 rounded-md no-underline hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-textPrimary dark:text-textPrimary-dark mb-1">{area.name}</p>
                        <p className="text-xs text-textMuted dark:text-textMuted-dark truncate">{area.description || t('areas.noDescription')}</p>
                      </div>
                      <span
                        className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium ${
                          area.status ? 'bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark' : 'bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark'
                        }`}
                      >
                        {area.status ? t('active') : t('inactive')}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-textMuted dark:text-textMuted-dark">{t('no_areas')}</p>
            )}
          </div>

          <div className="p-6 border-b border-border dark:border-border-dark">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">{t('sensors.title')}</h2>
              <Link to={`/sensors/create?organizationId=${organization.id}`}>
                <Button variant="outline" size="sm">{t('sensors.add')}</Button>
              </Link>
            </div>
            {sensors.length > 0 ? (
              <div>
                {sensors.map((s) => (
                  <div key={s.id} className="py-3 border-b border-border dark:border-border-dark last:border-0">
                    <Link
                      to={`/sensors/${s.id}`}
                      className="flex justify-between items-center p-2 rounded-md no-underline hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-textPrimary dark:text-textPrimary-dark mb-1">{s.name}</p>
                        <p className="text-xs text-textMuted dark:text-textMuted-dark">{s.uuid || ''}</p>
                      </div>
                      <span className="inline-flex items-center py-1 px-3 rounded-full text-xs font-medium bg-surfaceHover dark:bg-surfaceHover-dark text-textSecondary dark:text-textSecondary-dark">
                        {s.status ? t('active') : t('inactive')}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-textMuted dark:text-textMuted-dark">{t('no_sensors')}</p>
            )}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">{t('devices.title')}</h2>
              <Link to={`/devices/create?organizationId=${organization.id}`}>
                <Button variant="outline" size="sm">{t('devices.add')}</Button>
              </Link>
            </div>
            {devices.length > 0 ? (
              <div>
                {devices.map((device) => (
                  <div key={device.id} className="py-3 border-b border-border dark:border-border-dark last:border-0">
                    <Link
                      to={`/devices/${device.id}`}
                      className="flex justify-between items-center p-2 rounded-md no-underline hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-textPrimary dark:text-textPrimary-dark mb-1">{device.name}</p>
                        <p className="text-xs text-textMuted dark:text-textMuted-dark">{device.uuid}</p>
                      </div>
                      <span
                        className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium ${
                          device.status === 'active' ? 'bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark' : 'bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark'
                        }`}
                      >
                        {device.status === 'active' ? t('active') : t('inactive')}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-textMuted dark:text-textMuted-dark">{t('no_devices')}</p>
            )}
          </div>
        </div>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card dark:bg-card-dark rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dangerBg dark:bg-dangerBg-dark text-danger dark:text-danger-dark mr-4 flex-shrink-0">
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark">{t('organizations.delete')}</h3>
                  <p className="mt-2 text-sm text-textSecondary dark:text-textSecondary-dark">
                    {t('organizations.delete_organization_confirm', { name: organization.name })}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-surfaceHover dark:bg-surfaceHover-dark flex justify-end gap-3 rounded-b-lg">
              <Button type="button" variant="danger" isLoading={isDeleting} disabled={isDeleting} onClick={onDelete}>
                {t('common.delete')}
              </Button>
              <Button type="button" variant="outline" onClick={onCloseDeleteModal}>
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