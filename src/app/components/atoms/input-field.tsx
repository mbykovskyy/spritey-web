"use client";

import { generateRandomHash } from '../utils/random';
import Label from './label';
import { Input } from './input';
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
