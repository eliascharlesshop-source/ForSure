import { render, screen, fireEvent } from '@testing-library/react'
import { DesignDevToggle } from '../../components/ui/design-dev-toggle'

describe('DesignDevToggle Integration', () => {
  it('should render and switch between modes', () => {
    const onModeChange = jest.fn()
    
    const { rerender } = render(
      <DesignDevToggle 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Check initial state
    expect(screen.getByLabelText('Design mode')).toBeTruthy()
    expect(screen.getByLabelText('Development mode')).toBeTruthy()
    
    // Switch to dev mode
    rerender(
      <DesignDevToggle 
        mode="dev" 
        onModeChange={onModeChange} 
      />
    )
    
    expect(screen.getByLabelText('Design mode')).toBeTruthy()
    expect(screen.getByLabelText('Development mode')).toBeTruthy()
  })

  it('should call onModeChange when clicked', () => {
    const onModeChange = jest.fn()
    
    render(
      <DesignDevToggle 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Click dev mode
    fireEvent.click(screen.getByLabelText('Development mode'))
    expect(onModeChange).toHaveBeenCalledWith('dev')
    
    // Click design mode
    fireEvent.click(screen.getByLabelText('Design mode'))
    expect(onModeChange).toHaveBeenCalledWith('design')
  })
})
