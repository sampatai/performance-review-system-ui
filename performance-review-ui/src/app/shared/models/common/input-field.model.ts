export interface Options {
    value: any;
    label: string;
  }
  
  export interface InputField<T> {
    label: string;
    controlName: keyof T;
    type: 'text' | 'number' | 'email' | 'date' | 'select' | 'checkbox';
    options?: Options[];
    placeholder?: string;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
  }
  