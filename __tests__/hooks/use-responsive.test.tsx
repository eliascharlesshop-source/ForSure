import { renderHook, act } from '@testing-library/react'
import { useResponsive, useBreakpoint, useMediaQuery } from '../hooks/use-responsive'

// Mock window methods
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('useResponsive', () => {
  beforeEach(() => {
    window.innerWidth = 1024
    window.innerHeight = 768
    jest.clearAllMocks()
  })

  it('returns initial dimensions correctly', () => {
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.width).toBe(1024)
    expect(result.current.height).toBe(768)
    expect(result.current.currentBreakpoint).toBe('lg')
    expect(result.current.isDesktop).toBe(true)
    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isWide).toBe(false)
    expect(result.current.orientation).toBe('landscape')
  })

  it('detects mobile breakpoint correctly', () => {
    window.innerWidth = 500
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isMobile).toBe(true)
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(false)
    expect(result.current.isWide).toBe(false)
    expect(result.current.currentBreakpoint).toBe('sm')
  })

  it('detects tablet breakpoint correctly', () => {
    window.innerWidth = 800
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(true)
    expect(result.current.isDesktop).toBe(false)
    expect(result.current.isWide).toBe(false)
    expect(result.current.currentBreakpoint).toBe('md')
  })

  it('detects wide breakpoint correctly', () => {
    window.innerWidth = 1400
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(false)
    expect(result.current.isWide).toBe(true)
    expect(result.current.currentBreakpoint).toBe('xl')
  })

  it('detects portrait orientation', () => {
    window.innerWidth = 768
    window.innerHeight = 1024
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.orientation).toBe('portrait')
  })

  it('handles window resize', async () => {
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.width).toBe(1024)
    expect(result.current.currentBreakpoint).toBe('lg')

    // Simulate window resize
    act(() => {
      window.innerWidth = 500
      window.innerHeight = 800
      window.dispatchEvent(new Event('resize'))
    })

    // Wait for debounce
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150))
    })

    expect(result.current.width).toBe(500)
    expect(result.current.currentBreakpoint).toBe('sm')
    expect(result.current.isMobile).toBe(true)
    expect(result.current.orientation).toBe('portrait')
  })

  it('uses custom debounce time', async () => {
    const { result } = renderHook(() => useResponsive({ debounceMs: 50 }))
    
    act(() => {
      window.innerWidth = 500
      window.dispatchEvent(new Event('resize'))
    })

    // Should not update immediately
    expect(result.current.width).toBe(1024)

    // Wait for custom debounce time
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 60))
    })

    expect(result.current.width).toBe(500)
  })
})

describe('useBreakpoint', () => {
  beforeEach(() => {
    window.innerWidth = 1024
    jest.clearAllMocks()
  })

  it('matches exact breakpoint', () => {
    const { result } = renderHook(() => 
      useBreakpoint({ breakpoint: 'lg', match: 'exact' })
    )
    
    expect(result.current).toBe(true)
  })

  it('matches up breakpoint', () => {
    const { result } = renderHook(() => 
      useBreakpoint({ breakpoint: 'md', match: 'up' })
    )
    
    expect(result.current).toBe(true) // lg >= md
  })

  it('matches down breakpoint', () => {
    const { result } = renderHook(() => 
      useBreakpoint({ breakpoint: 'xl', match: 'down' })
    )
    
    expect(result.current).toBe(true) // lg <= xl
  })

  it('does not match up breakpoint when smaller', () => {
    window.innerWidth = 500
    const { result } = renderHook(() => 
      useBreakpoint({ breakpoint: 'lg', match: 'up' })
    )
    
    expect(result.current).toBe(false)
  })

  it('does not match down breakpoint when larger', () => {
    window.innerWidth = 1400
    const { result } = renderHook(() => 
      useBreakpoint({ breakpoint: 'md', match: 'down' })
    )
    
    expect(result.current).toBe(false)
  })

  it('defaults to up match', () => {
    const { result } = renderHook(() => 
      useBreakpoint({ breakpoint: 'md' })
    )
    
    expect(result.current).toBe(true) // lg >= md (up is default)
  })
})

describe('useMediaQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns false for non-matching query', () => {
    const mockMatchMedia = jest.fn().mockReturnValue({
      matches: false,
      media: '(max-width: 500px)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })
    
    window.matchMedia = mockMatchMedia
    
    const { result } = renderHook(() => 
      useMediaQuery({ query: '(max-width: 500px)' })
    )
    
    expect(result.current).toBe(false)
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 500px)')
  })

  it('returns true for matching query', () => {
    const mockMatchMedia = jest.fn().mockReturnValue({
      matches: true,
      media: '(max-width: 500px)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })
    
    window.matchMedia = mockMatchMedia
    
    const { result } = renderHook(() => 
      useMediaQuery({ query: '(max-width: 500px)' })
    )
    
    expect(result.current).toBe(true)
  })

  it('sets up event listener for changes', () => {
    const addEventListener = jest.fn()
    const removeEventListener = jest.fn()
    
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      media: '(max-width: 500px)',
      addEventListener,
      removeEventListener,
    })
    
    const { unmount } = renderHook(() => 
      useMediaQuery({ query: '(max-width: 500px)' })
    )
    
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    
    unmount()
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('handles media query changes', async () => {
    let changeCallback: ((e: MediaQueryListEvent) => void) | null = null
    
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      media: '(max-width: 500px)',
      addEventListener: jest.fn((event, callback) => {
        if (event === 'change') {
          changeCallback = callback as (e: MediaQueryListEvent) => void
        }
      }),
      removeEventListener: jest.fn(),
    })
    
    const { result } = renderHook(() => 
      useMediaQuery({ query: '(max-width: 500px)' })
    )
    
    expect(result.current).toBe(false)
    
    // Simulate media query change
    act(() => {
      changeCallback?.({
        matches: true,
        media: '(max-width: 500px)',
      } as MediaQueryListEvent)
    })
    
    expect(result.current).toBe(true)
  })

  it('uses custom debounce time', async () => {
    let changeCallback: ((e: MediaQueryListEvent) => void) | null = null
    
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      media: '(max-width: 500px)',
      addEventListener: jest.fn((event, callback) => {
        if (event === 'change') {
          changeCallback = callback as (e: MediaQueryListEvent) => void
        }
      }),
      removeEventListener: jest.fn(),
    })
    
    const { result } = renderHook(() => 
      useMediaQuery({ query: '(max-width: 500px)', debounceMs: 50 })
    )
    
    expect(result.current).toBe(false)
    
    // Simulate media query change
    act(() => {
      changeCallback?.({
        matches: true,
        media: '(max-width: 500px)',
      } as MediaQueryListEvent)
    })
    
    // Should not update immediately
    expect(result.current).toBe(false)
    
    // Wait for custom debounce time
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 60))
    })
    
    expect(result.current).toBe(true)
  })
})
