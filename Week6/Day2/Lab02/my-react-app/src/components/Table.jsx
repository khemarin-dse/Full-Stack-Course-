import React from "react";

export default function Table({ columns, data = [], onEdit, onDelete }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left border-collapse text-sm text-gray-600">
        
        {/* Table Header */}
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-700 border-b border-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 font-medium">
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="px-6 py-10 text-center text-gray-400 font-medium"
              >
                No records found.
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr key={item.id || rowIndex} className="hover:bg-gray-50 transition duration-150">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {/* Render custom cell template if provided, otherwise fallback to object key */}
                    {col.render ? col.render(item) : item[col.accessor]}
                  </td>
                ))}

                {/* Row Actions */}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition duration-150"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition duration-150"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}