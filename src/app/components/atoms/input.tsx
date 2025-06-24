"use client";

import tw, { css, styled } from 'twin.macro'

const InputStyles = tw`
  focus:z-20
  
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

const Input = styled.input(_ => [
  InputStyles,
  // label + input
  css`
    label + & {
      ${tw`rounded-lg`}
    }
  `,
  css`
    &:first-child {
      ${tw`rounded-s-lg`}
    }
  `,
  css`
    &:last-child {
      ${tw`rounded-e-lg`}
    }
  `
]);

export {
  Input
}
