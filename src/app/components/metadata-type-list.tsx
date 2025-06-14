"use client";

import RadioButtonList from "./radio-button-list";

type MetadataTypeListProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function MetadataTypeList({value, onChange}: MetadataTypeListProps) {
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
