import { Injectable, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorHandlingService {
  public handleHttpError(err: unknown, setErrorSignal: WritableSignal<string[]>): void {
    const errorResponse = err as { error?: { errors?: string[], message?: string } };
    const errors = errorResponse?.error?.errors;

    if (Array.isArray(errors)) {
      setErrorSignal.set(errors);
    } else {
      setErrorSignal.set([
        errorResponse?.error?.message ?? 'Failed to save changes. Please try again.',
      ]);
    }
  }
}
