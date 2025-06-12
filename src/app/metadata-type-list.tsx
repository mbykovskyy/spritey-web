"use client";

export default function MetadataTypeList({value, onChange}: {value: string, onChange: (value: string) => void}) {
  const options = [
    {value: 'json', label: 'JSON'},
    {value: 'xml', label: 'XML'}
  ];

  return (
    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {
        options.map(option => (
          <li key={option.value} className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
            <div className="flex items-center ps-3">
              <input
                id={`${option.value}-metadata-type-option`}
                type="radio"
                value={option.value}
                name="metadata-type-input"
                checked={value === option.value}
                onChange={e => onChange(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              />
              <label htmlFor={`${option.value}-metadata-type-option`} className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {option.label}
              </label>
            </div>
          </li>
        ))
      }
    </ul>
  );
}
