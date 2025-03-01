interface ValidationRule {
  validate: (value: any) => boolean
  message: string
}

interface ValidationRules {
  [key: string]: ValidationRule[]
}

interface ValidationErrors {
  [key: string]: string[]
}

export const useValidation = () => {
  const errors = ref<ValidationErrors>({})

  const rules = {
    required: (message = 'This field is required'): ValidationRule => ({
      validate: (value: any) => {
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === 'string') return value.trim().length > 0
        return value !== null && value !== undefined
      },
      message,
    }),

    email: (message = 'Please enter a valid email address'): ValidationRule => ({
      validate: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value)
      },
      message,
    }),

    minLength: (length: number, message = `Minimum length is ${length} characters`): ValidationRule => ({
      validate: (value: string) => value.length >= length,
      message,
    }),

    maxLength: (length: number, message = `Maximum length is ${length} characters`): ValidationRule => ({
      validate: (value: string) => value.length <= length,
      message,
    }),

    matches: (pattern: RegExp, message: string): ValidationRule => ({
      validate: (value: string) => pattern.test(value),
      message,
    }),

    url: (message = 'Please enter a valid URL'): ValidationRule => ({
      validate: (value: string) => {
        try {
          new URL(value)
          return true
        } catch {
          return false
        }
      },
      message,
    }),
  }

  const validate = (values: { [key: string]: any }, validationRules: ValidationRules) => {
    const newErrors: ValidationErrors = {}

    Object.keys(validationRules).forEach(field => {
      const fieldRules = validationRules[field]
      const value = values[field]
      const fieldErrors: string[] = []

      fieldRules.forEach(rule => {
        if (!rule.validate(value)) {
          fieldErrors.push(rule.message)
        }
      })

      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors
      }
    })

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const getFieldErrors = (field: string): string[] => {
    return errors.value[field] || []
  }

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  return {
    errors,
    rules,
    validate,
    clearErrors,
    getFieldErrors,
    hasErrors,
  }
} 