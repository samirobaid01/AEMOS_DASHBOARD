import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../../utils/cn';

export type SortDirection = 'asc' | 'desc';

export interface DataTableColumn<T> {
  /** Unique column key. */
  key: string;
  /** Header label. */
  header: React.ReactNode;
  /** Cell renderer for a row. */
  cell: (row: T) => React.ReactNode;
  /** Returns the primitive used for sorting. Omit to make the column non-sortable. */
  sortValue?: (row: T) => string | number | boolean | null | undefined;
  /** Extra classes for the <td>/<th> of this column. */
  className?: string;
  /** Align header + cells. */
  align?: 'left' | 'right' | 'center';
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  /** Enable the search box. Requires getSearchText. */
  searchable?: boolean;
  getSearchText?: (row: T) => string;
  searchPlaceholder?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  emptyMessage?: React.ReactNode;
  className?: string;
}

const alignClass = (align: DataTableColumn<unknown>['align']) =>
  align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

function compare(a: unknown, b: unknown): number {
  // nullish last
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'boolean' && typeof b === 'boolean') return a === b ? 0 : a ? 1 : -1;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  onRowClick,
  searchable = false,
  getSearchText,
  searchPlaceholder,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  emptyMessage,
  className,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!searchable || !getSearchText || !search.trim()) return data;
    const q = search.trim().toLowerCase();
    return data.filter((row) => getSearchText(row).toLowerCase().includes(q));
  }, [data, search, searchable, getSearchText]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((x, y) => compare(col.sortValue!(x), col.sortValue!(y)) * dir);
  }, [filtered, sortKey, sortDir, columns]);

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = useMemo(
    () => sorted.slice(safePage * pageSize, safePage * pageSize + pageSize),
    [sorted, safePage, pageSize],
  );

  const handleSort = (col: DataTableColumn<T>) => {
    if (!col.sortValue) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const rangeStart = total === 0 ? 0 : safePage * pageSize + 1;
  const rangeEnd = Math.min(total, safePage * pageSize + pageSize);

  return (
    <div className={cn('w-full', className)}>
      {/* Toolbar */}
      {(searchable || pageSizeOptions.length > 0) && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
          {searchable && (
            <div className="relative flex-1 min-w-0">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted dark:text-textMuted-dark pointer-events-none"
                aria-hidden
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder={searchPlaceholder ?? t('common.search')}
                className="block w-full pl-9 pr-3 py-2 rounded-lg border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
          )}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-sm text-textMuted dark:text-textMuted-dark">
              {t('common.perPage', { defaultValue: 'Per page' })}
            </label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="px-2 py-2 rounded-lg border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className="overflow-auto rounded-xl border border-border dark:border-border-dark"
        style={pageSize > 10 ? { maxHeight: '32rem' } : undefined}
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border dark:border-border-dark">
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    className={cn(
                      'sticky top-0 z-10 bg-surfaceHover dark:bg-surfaceHover-dark py-3 px-4 font-bold text-textPrimary dark:text-textPrimary-dark whitespace-nowrap border-b border-border dark:border-border-dark',
                      alignClass(col.align),
                      col.sortValue && 'cursor-pointer select-none hover:text-leaf-600 dark:hover:text-leaf-400',
                      col.className,
                    )}
                    onClick={() => handleSort(col)}
                    aria-sort={isSorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortValue &&
                        (isSorted ? (
                          sortDir === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5" aria-hidden />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" aria-hidden />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" aria-hidden />
                        ))}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 px-4 text-center text-textMuted dark:text-textMuted-dark"
                >
                  {emptyMessage ?? t('common.noResults', { defaultValue: 'No results' })}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr
                  key={getRowId(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'border-b border-border dark:border-border-dark last:border-0 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark',
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('py-3 px-4 text-textPrimary dark:text-textPrimary-dark', alignClass(col.align), col.className)}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / pagination */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
          <p className="text-xs text-textMuted dark:text-textMuted-dark m-0">
            {t('common.showingRange', {
              defaultValue: 'Showing {{start}}–{{end}} of {{total}}',
              start: rangeStart,
              end: rangeEnd,
              total,
            })}
          </p>
          {pageCount > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                aria-label={t('common.previous', { defaultValue: 'Previous' })}
                className="grid place-items-center w-8 h-8 rounded-lg border border-border dark:border-border-dark text-textSecondary dark:text-textSecondary-dark hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden />
              </button>
              <span className="text-sm font-bold text-textPrimary dark:text-textPrimary-dark tabular-nums">
                {safePage + 1} / {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={safePage >= pageCount - 1}
                aria-label={t('common.next', { defaultValue: 'Next' })}
                className="grid place-items-center w-8 h-8 rounded-lg border border-border dark:border-border-dark text-textSecondary dark:text-textSecondary-dark hover:bg-surfaceHover dark:hover:bg-surfaceHover-dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DataTable;
