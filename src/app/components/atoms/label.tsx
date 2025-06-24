"use client";

import tw, { css, styled } from 'twin.macro'

const LabelStyles = tw`
  block
  text-sm
  font-medium
  text-gray-900
  dark:text-gray-300
`;

export default styled.label(_ => [
  LabelStyles,
  // label + not(checkbox)
  css`
    &:has(+ *:not(input[type='checkbox'])) {
      ${tw`mb-2`}
    }
  `,
  // checkbox + label
  css`
    input[type='checkbox'] + & {
      ${tw`ms-2`}
    }
  `,
  // label + checkbox
  css`
    &:has(+ input[type='checkbox']) {
      ${tw`me-2`}
    }
  `
]);
