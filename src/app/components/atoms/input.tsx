"use client";

import tw, { styled } from 'twin.macro'

const InputStyles = tw`
  block
  w-full
  p-2.5

  text-sm
  text-gray-900
  dark:text-white

  bg-gray-50
  dark:bg-gray-700

  dark:placeholder-gray-400

  border

  border-gray-300
  dark:border-gray-600

  focus:border-blue-500
  dark:focus:border-blue-500

  focus:ring-blue-500
  dark:focus:ring-blue-500
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: HTMLElement
  insetIcon?: boolean
}

export default styled.input<InputProps>(({ insetIcon = true }) => [
  InputStyles,
  insetIcon ? tw`rounded-lg` : tw`rounded-e-lg`
]);
