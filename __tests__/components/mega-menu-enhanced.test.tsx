import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MegaMenu } from '../../components/mega-menu'

// Mock the toast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

describe('MegaMenu Enhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with notification badge', () => {
    const onModeChange = jest.fn()
    
    render(
      <MegaMenu 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Check that notification badge is present
    const notificationBadge = screen.getByText('3')
    expect(notificationBadge).toBeTruthy()
    expect(notificationBadge.parentElement).toHaveClass('bg-red-500')
  })

  it('opens dropdown when clicked', async () => {
    const onModeChange = jest.fn()
    
    render(
      <MegaMenu 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Click to open dropdown
    await userEvent.click(screen.getByRole('button'))
    
    // Check that dropdown content appears
    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeTruthy()
      expect(screen.getByText('Navigation')).toBeTruthy()
    })
  })

  it('shows new project dialog when new project is clicked', async () => {
    const onModeChange = jest.fn()
    
    render(
      <MegaMenu 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Open dropdown
    await userEvent.click(screen.getByRole('button'))
    
    // Click on new project
    await userEvent.click(screen.getByText('New Project'))
    
    // Check that dialog appears
    await waitFor(() => {
      expect(screen.getByText('Create New Project')).toBeTruthy()
      expect(screen.getByPlaceholderText('Project name...')).toBeTruthy()
    })
  })

  it('creates project with valid name', async () => {
    const onModeChange = jest.fn()
    const mockToast = jest.fn()
    
    jest.mock('@/components/ui/use-toast', () => ({
      useToast: () => ({
        toast: mockToast
      })
    }))
    
    render(
      <MegaMenu 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Open dropdown and new project dialog
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByText('New Project'))
    
    // Enter project name
    const nameInput = screen.getByPlaceholderText('Project name...')
    await userEvent.type(nameInput, 'Test Project')
    
    // Click create
    await userEvent.click(screen.getByText('Create Project'))
    
    // Check that success toast was called
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Project created",
        description: "Project \"Test Project\" has been created successfully",
      })
    })
  })

  it('shows error for empty project name', async () => {
    const onModeChange = jest.fn()
    const mockToast = jest.fn()
    
    jest.mock('@/components/ui/use-toast', () => ({
      useToast: () => ({
        toast: mockToast
      })
    }))
    
    render(
      <MegaMenu 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Open dropdown and new project dialog
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByText('New Project'))
    
    // Click create without entering name
    await userEvent.click(screen.getByText('Create Project'))
    
    // Check that error toast was called
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Project name required",
        description: "Please enter a project name",
        variant: "destructive",
      })
    })
  })

  it('opens export dialog with options', async () => {
    const onModeChange = jest.fn()
    
    render(
      <MegaMenu 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Open dropdown
    await userEvent.click(screen.getByRole('button'))
    
    // Click on export
    await userEvent.click(screen.getByText('Export'))
    
    // Check that export dialog appears with options
    await waitFor(() => {
      expect(screen.getByText('Export Project')).toBeTruthy()
      expect(screen.getByText('ForSure (.forsure)')).toBeTruthy()
      expect(screen.getByText('JSON (.json)')).toBeTruthy()
      expect(screen.getByText('ZIP Archive (.zip)')).toBeTruthy()
      expect(screen.getByText('Include Assets')).toBeTruthy()
    })
  })

  it('opens settings dialog with preferences', async () => {
    const onModeChange = jest.fn()
    
    render(
      <MegaMenu 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Open dropdown
    await userEvent.click(screen.getByRole('button'))
    
    // Click on settings
    await userEvent.click(screen.getByText('Settings'))
    
    // Check that settings dialog appears
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeTruthy()
      expect(screen.getByText('Theme')).toBeTruthy()
      expect(screen.getByText('Auto-save')).toBeTruthy()
      expect(screen.getByText('Notifications')).toBeTruthy()
    })
  })

  it('switches between design and dev modes', async () => {
    const onModeChange = jest.fn()
    
    const { rerender } = render(
      <MegaMenu 
        mode="design" 
        onModeChange={onModeChange} 
      />
    )
    
    // Open dropdown
    await userEvent.click(screen.getByRole('button'))
    
    // Click on dev mode
    await userEvent.click(screen.getByText('Dev Mode'))
    
    // Check that mode change was called
    expect(onModeChange).toHaveBeenCalledWith('dev')
    
    // Rerender with dev mode
    rerender(
      <MegaMenu 
        mode="dev" 
        onModeChange={onModeChange} 
      />
    )
    
    // Open dropdown again
    await userEvent.click(screen.getByRole('button'))
    
    // Click on design mode
    await userEvent.click(screen.getByText('Design Mode'))
    
    expect(onModeChange).toHaveBeenCalledWith('design')
  })
})
