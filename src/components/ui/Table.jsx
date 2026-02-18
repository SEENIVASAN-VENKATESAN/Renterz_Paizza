export default function Table({ columns, data, emptyText = 'No records found' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-base">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-surface text-sm">
          <thead className="surface-soft">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-soft">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data.length && (
              <tr>
                <td className="px-4 py-6 text-center text-soft" colSpan={columns.length}>
                  {emptyText}
                </td>
              </tr>
            )}
            {data.map((row) => (
              <tr key={row.id} className="border-t border-base">
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-4 py-3 text-main">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}