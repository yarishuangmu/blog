import { ref, computed } from 'vue'

export interface FormField<T = any> {
  value: T
  error: string | null
  touched: boolean
  required?: boolean
  validate?: (value: T) => string | null
}

export type FormState = Record<string, FormField<any>>

export const useForm = <T extends FormState>(initialState: T) => {
  const form = ref<T>(initialState)
  const loading = ref(false)
  const submitError = ref<string | null>(null)

  const isDirty = computed(() => {
    return Object.values(form.value).some((field) => {
      const formField = field as FormField
      return formField.touched
    })
  })

  const isValid = computed(() => {
    return Object.values(form.value).every((field) => {
      const formField = field as FormField
      return !formField.error
    })
  })

  const validateField = (name: keyof T) => {
    const field = form.value[name]
    if (!field) return

    let error: string | null = null

    if (field.required && !field.value) {
      error = 'This field is required'
    } else if (field.validate) {
      error = field.validate(field.value)
    }

    field.error = error
    field.touched = true
  }

  const validateForm = () => {
    Object.keys(form.value).forEach(key => {
      validateField(key as keyof T)
    })
    return isValid.value
  }

  const setFieldValue = <K extends keyof T>(
    name: K,
    value: T[K]['value']
  ) => {
    const field = form.value[name]
    if (!field) return

    field.value = value
    field.touched = true
    validateField(name)
  }

  const resetField = (name: keyof T) => {
    const field = form.value[name]
    if (!field) return

    field.value = initialState[name].value
    field.error = null
    field.touched = false
  }

  const resetForm = () => {
    Object.keys(form.value).forEach(key => {
      resetField(key as keyof T)
    })
    submitError.value = null
    loading.value = false
  }

  type FormValues = { [K in keyof T]: T[K]['value'] }

  const handleSubmit = async (callback: (values: FormValues) => Promise<void>) => {
    loading.value = true
    submitError.value = null

    try {
      if (!validateForm()) {
        throw new Error('Please fix the errors before submitting')
      }

      const values = Object.entries(form.value).reduce((acc, [key, field]) => {
        const formField = field as FormField
        acc[key as keyof T] = formField.value
        return acc
      }, {} as FormValues)

      await callback(values)
    } catch (error: any) {
      submitError.value = error.message
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    loading,
    submitError,
    isDirty,
    isValid,
    setFieldValue,
    validateField,
    validateForm,
    resetField,
    resetForm,
    handleSubmit,
  }
} 