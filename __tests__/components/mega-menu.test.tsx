import { render, screen, fireEvent } from '@testing-library/react'
import { MegaMenu } from '../../components/mega-menu'

describe('MegaMenu', () => {
  it('renders with current mode displayed', () => {
    const onModeChange = jest.fn()
    
    render(
      <MegaMenu 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Check that the trigger button renders with correct content
    expect(screen.getByText('Design Mode')).toBeTruthy()
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('renders with dev mode displayed', () => {
    const onModeChange = jest.fn()
    
    render(
      <MegaMenu 
        mode="dev" 
        onModeChange={onModeChange} 
      />
    )
    
    // Check that the trigger button renders with correct content
    expect(screen.getByText('Dev Mode')).toBeTruthy()
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('opens dropdown when clicked', () => {
    const onModeChange = jest.fn()
    
    render(
      <MegaMenu 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Click to open dropdown
    fireEvent.click(screen.getByRole('button'))
    
    // Check that dropdown content appears
    expect(screen.getByText('Visual whiteboard interface')).toBeTruthy()
    expect(screen.getByText('Classic development interface')).toBeTruthy()
  })

  it('calls onModeChange when mode is clicked', () => {
    const onModeChange = jest.fn()
    
    render(
      <MegaMenu 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Open dropdown
    fireEvent.click(screen.getByRole('button'))
    
    // Click on dev mode
    fireEvent.click(screen.getByText('Dev Mode'))
    expect(onModeChange).toHaveBeenCalledWith('dev')
  })

  it('shows active badge for current mode', () => {
    const onModeChange = jest.fn()
    
    render(
      <MegaMenu 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Open dropdown
    fireEvent.click(screen.getByRole('button'))
    
    // Check that design mode has active badge
    expect(screen.getByText('Active')).toBeTruthy()
    
    // Check that dev mode doesn't have active badge
    const devModeItems = screen.getAllByText('Dev Mode')
    expect(devModeItems).toHaveLength(2) // One in trigger, one in dropdown
  })
})
