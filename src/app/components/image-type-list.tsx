"use client";

import RadioButtonList from "./radio-button-list";

type ImageTypeListProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ImageTypeList({value, onChange}: ImageTypeListProps) {
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
