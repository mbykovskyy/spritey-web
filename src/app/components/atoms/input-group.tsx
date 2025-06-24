"use client";

import tw, { css, styled } from 'twin.macro'

const InputGroup = tw.div`
  flex
`;

const TextStyles = tw`
  inline-flex
  items-center
  
  px-3
  
  border
  border-gray-300
  dark:border-gray-600

  text-gray-900
  dark:text-gray-400

  bg-gray-200
  dark:bg-gray-600
`;

const Text = styled.span(_ => [
  TextStyles,
  css`
    &:first-child {
      ${tw`
        border-e-0
        rounded-s-md
      `}
    }
  `,
  css`
    &:last-child {
      ${tw`
        border-s-0
        rounded-e-md
      `}
    }
  `
]);

export {
  InputGroup,
  Text,
}
