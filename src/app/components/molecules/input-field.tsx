"use client";

import { generateRandomHash } from '../utils/random';
import Label from '../atoms/label';
import { Input } from '../atoms/input';
import { InputHTMLAttributes } from 'react';

type InputFieldProps = {
  label: string
} & InputHTMLAttributes<HTMLInputElement>

export default function InputField(props: InputFieldProps) {
  const id = `id_${generateRandomHash()}`;
  return (
    <div>
      <Label htmlFor={id}>{props.label}</Label>
      <Input id={id} { ...props } />
    </div>
  )
}
