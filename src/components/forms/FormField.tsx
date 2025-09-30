import * as React from 'react';
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
  type ControllerProps,
} from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { SelectField, SelectItem, SelectContent } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getFormFieldProps } from '@/lib/forms/form-utils';

/**
 * Base FormField component that integrates react-hook-form with UI components
 */
export interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  children: (props: {
    field: {
      value: T[FieldPath<T>];
      onChange: (value: unknown) => void;
      onBlur: () => void;
      name: string;
    };
    fieldState: {
      error?: string;
      isDirty: boolean;
      isTouched: boolean;
    };
    formState: {
      isSubmitting: boolean;
      isLoading: boolean;
    };
  }) => React.ReactElement;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  rules?: ControllerProps<T, FieldPath<T>>['rules'];
}

/**
 * FormField component that integrates react-hook-form with UI components
 */
export function FormField<T extends FieldValues>({
  form,
  name,
  children,
  required = false,
  disabled = false,
  loading = false,
  rules,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={form.control}
      rules={rules}
      render={({ field, fieldState, formState }) => {
        const fieldProps = getFormFieldProps(form, name, {
          required,
          disabled,
          loading,
        });

        return children({
          field: {
            value: field.value,
            onChange: field.onChange,
            onBlur: field.onBlur,
            name: field.name,
          },
          fieldState: {
            error: fieldProps.error,
            isDirty: fieldState.isDirty,
            isTouched: fieldState.isTouched,
          },
          formState: {
            isSubmitting: formState.isSubmitting,
            isLoading: formState.isLoading,
          },
        });
      }}
    />
  );
}

/**
 * FormInput - Input field with react-hook-form integration
 */
export interface FormInputProps<T extends FieldValues>
  extends Omit<FormFieldProps<T>, 'children'> {
  label?: string;
  placeholder?: string;
  type?: string;
  helperText?: string;
  className?: string;
}

export function FormInput<T extends FieldValues>({
  label,
  placeholder,
  type = 'text',
  helperText,
  className,
  ...formFieldProps
}: FormInputProps<T>) {
  return (
    <FormField {...formFieldProps}>
      {({ field, fieldState }) => (
        <Input
          {...field}
          type={type}
          label={label}
          placeholder={placeholder}
          helperText={fieldState.error ?? helperText}
          errorText={fieldState.error}
          disabled={formFieldProps.disabled}
          loading={formFieldProps.loading}
          required={formFieldProps.required}
          className={className}
        />
      )}
    </FormField>
  );
}

/**
 * FormSelect - Select field with react-hook-form integration
 */
export interface FormSelectProps<T extends FieldValues>
  extends Omit<FormFieldProps<T>, 'children'> {
  label?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  className?: string;
  helperText?: string;
}

export function FormSelect<T extends FieldValues>({
  label,
  placeholder,
  options,
  className,
  helperText,
  ...formFieldProps
}: FormSelectProps<T>) {
  return (
    <FormField {...formFieldProps}>
      {({ field, fieldState }) => (
        <div className={className}>
          <SelectField
            value={field.value ?? ''}
            onValueChange={field.onChange}
            label={label}
            placeholder={placeholder}
            error={fieldState.error}
            disabled={formFieldProps.disabled}
            required={formFieldProps.required}
          >
            <SelectContent>
              {options.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectField>
          {helperText && !fieldState.error && (
            <p className="text-muted-foreground mt-1 text-sm">{helperText}</p>
          )}
        </div>
      )}
    </FormField>
  );
}

/**
 * FormCheckbox - Checkbox field with react-hook-form integration
 */
export interface FormCheckboxProps<T extends FieldValues>
  extends Omit<FormFieldProps<T>, 'children'> {
  label?: string;
  description?: string;
  className?: string;
}

export function FormCheckbox<T extends FieldValues>({
  label,
  description,
  className,
  ...formFieldProps
}: FormCheckboxProps<T>) {
  return (
    <FormField {...formFieldProps}>
      {({ field, fieldState }) => (
        <div className={className}>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              disabled={formFieldProps.disabled}
            />
            {label && (
              <label
                htmlFor={field.name}
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
                {formFieldProps.required && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </label>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          )}
          {fieldState.error && (
            <p className="mt-1 text-sm text-red-500">{fieldState.error}</p>
          )}
        </div>
      )}
    </FormField>
  );
}

/**
 * FormErrors - Display form-level errors
 */
export interface FormErrorsProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  className?: string;
}

export function FormErrors<T extends FieldValues>({
  form,
  className,
}: FormErrorsProps<T>) {
  const errors = form.formState.errors;
  const errorKeys = Object.keys(errors);

  if (errorKeys.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Please fix the following errors:
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc space-y-1 pl-5">
                {errorKeys.map(key => {
                  const error = errors[key as keyof typeof errors];
                  const message = error?.message;
                  return (
                    <li key={key}>
                      {typeof message === 'string'
                        ? message
                        : `Invalid value for ${key}`}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
