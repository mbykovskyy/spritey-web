"use client";

import RadioButtonList from "./radio-button-list";

export default function ImageTypeList({value, onChange}: {value: string, onChange: (value: string) => void}) {
  const options = [
    {value: 'png', label: 'PNG'},
    {value: 'jpeg', label: 'JPEG'}
  ];

  return (
    <RadioButtonList
      fieldName="image-type"
      options={options}
      value={value}
      onChange={onChange}
    />
  );
}
