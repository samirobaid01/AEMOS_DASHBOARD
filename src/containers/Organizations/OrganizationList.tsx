import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import { 
  fetchOrganizations, 
  selectOrganizations, 
  selectOrganizationsLoading,
  selectOrganizationsError
} from '../../state/slices/organizations.slice';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import type { OrganizationFilterParams } from '../../types/organization';

const OrganizationList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const organizations = useSelector(selectOrganizations);
  const isLoading = useSelector(selectOrganizationsLoading);
  const error = useSelector(selectOrganizationsError);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const [filters, setFilters] = useState<OrganizationFilterParams>({});
  
  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters: OrganizationFilterParams = { ...filters };
    
    if (searchTerm) {
      newFilters.search = searchTerm;
    } else {
      delete newFilters.search;
    }
    
    if (statusFilter !== undefined) {
      newFilters.status = statusFilter;
    } else {
      delete newFilters.status;
    }
    
    setFilters(newFilters);
    dispatch(fetchOrganizations(newFilters));
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(undefined);
    setFilters({});
    dispatch(fetchOrganizations({}));
  };
  
  if (isLoading && organizations.length === 0) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{t('organizations')}</h1>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/organizations/create"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="-ml-0.5 mr-1.5 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {t('new_organization')}
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                {t('search')}
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={t('search_organizations')}
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                {t('status')}
              </label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  value={statusFilter === undefined ? '' : statusFilter ? 'active' : 'inactive'}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setStatusFilter(undefined);
                    } else {
                      setStatusFilter(e.target.value === 'active');
                    }
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">{t('all')}</option>
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('clear')}
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('filter')}
            </button>
          </div>
        </form>
      </div>
      
      {/* Organizations List */}
      <div className="mt-8 flex flex-col">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {organizations.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        {t('name')}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {t('status')}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {t('contact')}
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">{t('actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {organizations.map((org) => (
                      <tr key={org.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                              {org.image ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={org.image}
                                  alt={org.name}
                                />
                              ) : (
                                <span className="text-lg font-medium text-gray-600">
                                  {org.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                <Link to={`/organizations/${org.id}`} className="hover:text-blue-600">
                                  {org.name}
                                </Link>
                              </div>
                              {org.detail && (
                                <div className="text-gray-500 truncate max-w-xs">{org.detail}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              org.status
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {org.status ? t('active') : t('inactive')}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{org.email || '-'}</div>
                          <div>{org.contactNumber || '-'}</div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            to={`/organizations/${org.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            {t('edit')}
                          </Link>
                          <Link
                            to={`/organizations/${org.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {t('view')}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {t('no_organizations')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {t('no_organizations_description')}
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/organizations/create"
                      className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg
                        className="-ml-0.5 mr-1.5 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t('new_organization')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationList; 