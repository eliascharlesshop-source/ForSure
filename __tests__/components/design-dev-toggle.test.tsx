import { render, screen } from '@testing-library/react'
import { DesignDevToggle } from '../../components/ui/design-dev-toggle'

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))

describe('DesignDevToggle', () => {
  it('renders with default mode', () => {
    const onModeChange = jest.fn()
    render(
      <DesignDevToggle 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    expect(screen.getByLabelText('Design mode')).toBeTruthy()
    expect(screen.getByLabelText('Development mode')).toBeTruthy()
    expect(screen.getByText('Design')).toBeTruthy()
    expect(screen.getByText('Dev')).toBeTruthy()
  })

  it('calls onModeChange when design mode is clicked', () => {
    const onModeChange = jest.fn()
    render(
      <DesignDevToggle 
        mode="dev" 
        onModeChange={onModeChange} 
      />
    )
    
    const designButton = screen.getByLabelText('Design mode')
    designButton.click()
    expect(onModeChange).toHaveBeenCalledWith('design')
  })

  it('calls onModeChange when dev mode is clicked', () => {
    const onModeChange = jest.fn()
    render(
      <DesignDevToggle 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    const devButton = screen.getByLabelText('Development mode')
    devButton.click()
    expect(onModeChange).toHaveBeenCalledWith('dev')
  })

  it('has proper accessibility attributes', () => {
    const onModeChange = jest.fn()
    render(
      <DesignDevToggle 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    expect(screen.getByLabelText('Design mode')).toBeTruthy()
    expect(screen.getByLabelText('Development mode')).toBeTruthy()
  })
})
