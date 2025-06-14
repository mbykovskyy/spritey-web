"use client";

import RadioButtonList from "./radio-button-list";

export default function MetadataTypeList({value, onChange}: {value: string, onChange: (value: string) => void}) {
  const options = [
    {value: 'json', label: 'JSON'},
    {value: 'xml', label: 'XML'}
  ];

  return (
    <RadioButtonList
      fieldName="metadata-type"
      options={options}
      value={value}
      onChange={onChange}
    />
  );
}
