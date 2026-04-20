export type FieldRule = {
  required?: boolean;
  pattern?: RegExp;
  validate?: (value: any) => boolean | string;
  message?: string;
};

export type ValidationSchema = Record<string, FieldRule>;

export type ValidationErrors = Record<string, string>;

export function validateFields<T extends Record<string, any>>(
  data: T,
  schema: ValidationSchema
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field in schema) {
    const value = data[field];
    const rules = schema[field];

    if (rules.required && (!value || value.toString().trim() === '')) {
      errors[field] = rules.message || `${field} is required`;
      continue;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message || `${field} is invalid`;
      continue;
    }

    if (rules.validate) {
      const result = rules.validate(value);
      if (result !== true) {
        errors[field] =
          typeof result === 'string'
            ? result
            : rules.message || `${field} is invalid`;
      }
    }
  }

  return errors;
}
