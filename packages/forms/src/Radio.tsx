import * as React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { Field, FieldProps, FieldConfig } from 'formik';
import { Span } from '@truework/ui';

import { Label } from './Label';

export type RadioProps = {
  hasError?: boolean;
  name?: string;
  checked?: boolean;
  value: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export type RadioFieldProps = {
  name: string;
} & Omit<RadioProps, 'checked' | 'value'> &
  Pick<FieldConfig, 'validate'>;

export type RadioFieldWithLabelProps = { label: string } & RadioFieldProps;

const RadioGroup = styled.div<{ hasError: boolean }>(
  ({ theme, hasError }) => `
    width: 100%;
    border: 1px solid ${theme.colors.outline};
    border-radius: 4px;

    ${RadioButton} {
      padding: ${theme.space.sm};
      border-top: 1px solid ${theme.colors.outline};

      &:first-of-type {
        border-top: 0;
      }
    }

    ${hasError
      ? `
          border-color: ${theme.colors.error} !important;

          & ${RadioButton} {
            border-color: ${theme.colors.error} !important;
          }
        `
      : ``}
  `
);

const Check = styled.div<{ checked?: boolean }>(
  ({ theme, checked }) => `
    position: relative;
    width: 16px;
    height: 16px;
    border-radius: 100%;
    margin-top: 2px;
    margin-right: 8px;
    border: 1px solid ${checked ? theme.colors.primaryDark : theme.colors.outline};
    z-index: 1;
    transition-property: background, border-color;
    transition-duration: ${theme.transitionDurations.fast};
    transition-timing-function: ${theme.transitionTimingFunctions.ease};

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background: white;
      transition-property: transform;
      transition-duration: ${theme.transitionDurations.fast};
      transition-timing-function: ${theme.transitionTimingFunctions.ease};
      transform: scale(0);
    }
  `
);

const Input = styled.input(
  ({ theme }) => `
    position: relative;
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    position: absolute;
    whitespace: nowrap;
    wordwrap: normal;
    z-index: 1;

    &:focus ~ ${Check} {
      border-color: ${theme.colors.primaryDark};
    }
    &:checked ~ ${Check} {
      background: ${theme.colors.primary};
      border-color: ${theme.colors.primaryDark};

      &::after {
        transform: scale(1);
      }
    }
    &:disabled ~ ${Check} {
      border-color: ${theme.colors.outline} !important;
    }
    &:disabled ~ ${Span} {
      color: ${theme.colors.secondary};
    }
    &:disabled ~ ${Bg} {
      background-color: ${theme.colors.background};
    }
  `
);

const Bg = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
  z-index: 0;
`;

const RadioButton = styled.label(
  ({ theme }) => `
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    margin-bottom: 0 !important;
    cursor: pointer;
    overflow: hidden;

    &:hover ${Check} {
      border-color: ${theme.colors.primaryDark};
    }
  `
);

export function Radio({
  children,
  name,
  checked,
  ...props
}: RadioProps) {
  const id = name + props.value;

  return (
    <RadioButton htmlFor={id}>
      <Input
        id={id}
        name={name}
        type="radio"
        checked={checked}
        {...props}
      />

      <Check checked={checked} />

      <Span display="block" position="relative" zIndex={1} width="calc(100% - 16px)" fontSize={1} lineHeight={1} fontWeight={5}>
        {children}
      </Span>

      <Bg />
    </RadioButton>
  );
}

export function RadioField({
  children,
  name,
  validate,
  onChange,
  onBlur,
  ...rest
}: React.PropsWithChildren<RadioFieldProps>) {
  return (
    <Field name={name} validate={validate}>
      {({ field, form }: FieldProps) => {
        const hasError = Boolean(get(form, ['errors', name]));

        return (
          <RadioGroup hasError={hasError}>
            {React.Children.toArray(children).map((child: React.ReactElement) => {
              return React.cloneElement(child, {
                ...field,
                ...rest,
                value: child.props.value,
                hasError,
                checked: Boolean(field.value === child.props.value),
                onChange(e: React.ChangeEvent<HTMLInputElement>) {
                  field.onChange(e);
                  if (onChange) onChange(e);
                },
                onBlur(e: React.FocusEvent<HTMLInputElement>) {
                  field.onBlur(e);
                  if (onBlur) onBlur(e);
                },
              });
            })}
          </RadioGroup>
        );
      }}
    </Field>
  );
}

export function RadioFieldWithLabel(props: RadioFieldWithLabelProps) {
  return (
    <>
      <Label htmlFor={props.name}>{props.label}</Label>
      <RadioField {...props} />
    </>
  );
}
