import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../components/ui/forsure-button'

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}))

describe('Button', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="brand">Brand Button</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('bg-brand-primary')

    rerender(<Button variant="outline">Outline Button</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('border', 'border-input')
  })

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('h-9', 'px-3')

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-11', 'px-8')
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    const button = screen.getByRole('button')
    
    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state correctly', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveClass('cursor-not-allowed')
    expect(screen.getByText('Loading')).toBeInTheDocument()
    expect(button.querySelector('svg')).toBeInTheDocument() // Loading spinner
  })

  it('renders with icons', () => {
    const LeftIcon = () => <div data-testid="left-icon">L</div>
    const RightIcon = () => <div data-testid="right-icon">R</div>
    
    render(
      <Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
        With Icons
      </Button>
    )
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('custom-class')
  })

  it('supports asChild prop', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent('Link Button')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('has proper accessibility attributes', () => {
    render(<Button aria-label="Custom label">Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('aria-label', 'Custom label')
  })

  it('focuses correctly with keyboard', async () => {
    const user = userEvent.setup()
    render(<Button>Focus Test</Button>)
    const button = screen.getByRole('button')
    
    await user.tab()
    expect(button).toHaveFocus()
  })

  it('handles keyboard events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Keyboard Test</Button>)
    const button = screen.getByRole('button')
    
    button.focus()
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(1)
    
    handleClick.mockClear()
    await user.keyboard('{ }') // Space key
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not trigger click when disabled', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    const button = screen.getByRole('button')
    
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('shows loading text when loading', () => {
    render(<Button loading loadingText="Processing...">Normal Text</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveTextContent('Processing...')
    expect(button).not.toHaveTextContent('Normal Text')
  })
})
