import { 
  getColorValue, 
  getContrastRatio, 
  getAccessibleColor,
  cn,
  createResponsiveClasses,
  debounce,
  throttle
} from '../lib/ui-utils'

describe('UI Utils', () => {
  describe('getColorValue', () => {
    it('returns color value for valid path', () => {
      expect(getColorValue('brand.primary')).toBe('#8CFFE6')
      expect(getColorValue('semantic.success')).toBe('#10B981')
    })

    it('returns default color for invalid path', () => {
      expect(getColorValue('invalid.path')).toBe('#000000')
    })
  })

  describe('getContrastRatio', () => {
    it('calculates contrast ratio correctly', () => {
      expect(getContrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0)
      expect(getContrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 0)
      expect(getContrastRatio('#8CFFE6', '#000000')).toBeGreaterThan(4.5)
    })

    it('handles invalid colors gracefully', () => {
      expect(getContrastRatio('invalid', '#FFFFFF')).toBe(1)
    })
  })

  describe('getAccessibleColor', () => {
    it('returns white for dark backgrounds', () => {
      expect(getAccessibleColor('#000000')).toBe('#FFFFFF')
      expect(getAccessibleColor('#0A4D68')).toBe('#FFFFFF')
    })

    it('returns black for light backgrounds', () => {
      expect(getAccessibleColor('#FFFFFF')).toBe('#000000')
      expect(getAccessibleColor('#8CFFE6')).toBe('#000000')
    })
  })

  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
      expect(cn('class1', null, 'class2')).toBe('class1 class2')
      expect(cn('class1', false, 'class2')).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      expect(cn('base', { 'active': true, 'disabled': false })).toBe('base active')
      expect(cn('base', { 'active': false, 'disabled': true })).toBe('base disabled')
    })
  })

  describe('createResponsiveClasses', () => {
    it('creates responsive class strings', () => {
      expect(createResponsiveClasses('text-sm', 'text-md', 'text-lg', 'text-xl'))
        .toBe('text-sm md:text-md lg:text-lg xl:text-xl')
    })

    it('handles optional breakpoints', () => {
      expect(createResponsiveClasses('text-sm', 'text-md'))
        .toBe('text-sm md:text-md')
      expect(createResponsiveClasses('text-sm'))
        .toBe('text-sm')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('delays function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('cancels previous calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('limits function execution rate', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1)

      throttledFn()
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(100)
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })
})
