import React, { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
  headerClassName?: string;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  rowClassName?: string | ((row: T) => string);
  headerClassName?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
}

export function DataTable<T>({ 
  columns, 
  data, 
  keyExtractor,
  emptyMessage = 'No data available',
  onRowClick,
  rowClassName = '',
  headerClassName = '',
  striped = false,
  hoverable = true,
  bordered = true
}: DataTableProps<T>) {
  const getRowClassName = (row: T, index: number) => {
    const baseClass = 'border-b border-border last:border-0';
    const stripedClass = striped && index % 2 === 1 ? 'bg-accent/30' : '';
    const hoverClass = hoverable ? 'hover:bg-accent/50 transition-colors' : '';
    const customClass = typeof rowClassName === 'function' ? rowClassName(row) : rowClassName;
    const clickableClass = onRowClick ? 'cursor-pointer' : '';
    return `${baseClass} ${stripedClass} ${hoverClass} ${customClass} ${clickableClass}`.trim();
  };

  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor] as ReactNode;
  };

  return (
    <div className={`bg-white rounded-lg overflow-hidden ${bordered ? 'border border-border' : ''}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`bg-accent border-b border-border ${headerClassName}`}>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`text-left p-4 text-sm font-medium ${column.headerClassName || ''}`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={keyExtractor(row)} 
                  className={getRowClassName(row, rowIndex)}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className={`p-4 ${column.className || ''}`}>
                      {getCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
