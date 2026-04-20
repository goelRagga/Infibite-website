export type FieldConfig<T> = {
  value: string;
  name: keyof T;
  label: string;
  type?:
    | 'text'
    | 'email'
    | 'date'
    | 'phone'
    | 'radio'
    | 'dob'
    | 'number'
    | 'textarea'
    | 'daterange';
  options?: string[]; // For radio types
  disablePastDates: boolean;
  fromField?: string; // For daterange type
  toField?: string; // For daterange type
};
