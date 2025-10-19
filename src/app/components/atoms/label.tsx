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
  // label + not(checkbox OR radio)
  css`
    &:has(+ *:not(input[type='checkbox'])),
    &:has(+ *:not(input[type='radio'])) {
      ${tw`mb-2`}
    }
  `,
  // checkbox/radio + label
  css`
    input[type='checkbox'] + &,
    input[type='radio'] + & {
      ${tw`ms-2`}
    }
  `,
  // label + checkbox/radio
  css`
    &:has(+ input[type='checkbox']),
    &:has(+ input[type='radio']) {
      ${tw`me-2`}
    }
  `
]);
