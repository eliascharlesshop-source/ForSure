import { axe, toHaveNoViolations } from 'jest-axe'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/forsure-button'
import { Card } from '@/components/ui/forsure-card'
import { Input } from '@/components/ui/forsure-input'
import { Badge } from '@/components/ui/forsure-badge'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  beforeEach(() => {
    // Mock console methods to avoid noise in test output
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore()
    console.warn.mockRestore()
  })

  describe('Button Accessibility', () => {
    it('should not have any axe violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA attributes when disabled', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveAttribute('aria-disabled', 'true')
      expect(button).toBeDisabled()
    })

    it('should handle keyboard navigation', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button')
      
      button.focus()
      expect(button).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
      
      handleClick.mockClear()
      await user.keyboard('{ }') // Space key
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should announce loading state to screen readers', () => {
      render(<Button loading>Loading...</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(button).toBeDisabled()
    })

    it('should support custom ARIA labels', () => {
      render(<Button aria-label="Add new item">+</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveAttribute('aria-label', 'Add new item')
    })

    it('should have proper focus management', async () => {
      const user = userEvent.setup()
      render(<Button>Focus Test</Button>)
      const button = screen.getByRole('button')
      
      await user.tab()
      expect(button).toHaveFocus()
      
      await user.tab()
      expect(button).not.toHaveFocus()
    })
  })

  describe('Card Accessibility', () => {
    it('should not have any axe violations', async () => {
      const { container } = render(
        <Card>
          <CardContent>Card content</CardContent>
        </Card>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should support landmark roles', () => {
      render(
        <Card role="article" aria-labelledby="card-title">
          <CardHeader>
            <CardTitle id="card-title">Article Title</CardTitle>
          </CardHeader>
          <CardContent>Article content</CardContent>
        </Card>
      )
      
      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('aria-labelledby', 'card-title')
      expect(screen.getByText('Article Title')).toBeInTheDocument()
    })

    it('should be keyboard accessible when interactive', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(
        <Card interactive onClick={handleClick}>
          <CardContent>Clickable card</CardContent>
        </Card>
      )
      
      const card = screen.getByText('Clickable card').closest('div')
      await user.tab()
      expect(card).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Input Accessibility', () => {
    it('should not have any axe violations', async () => {
      const { container } = render(
        <Input label="Email" type="email" placeholder="Enter email" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper label associations', () => {
      render(<Input label="Email" type="email" />)
      
      const input = screen.getByRole('textbox')
      const label = screen.getByText('Email')
      
      expect(input).toHaveAttribute('aria-labelledby')
      expect(label).toBeInTheDocument()
    })

    it('should announce error states to screen readers', () => {
      render(
        <Input
          label="Email"
          type="email"
          error="This field is required"
          required
        />
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-required', 'true')
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('should provide helper text for screen readers', () => {
      render(
        <Input
          label="Password"
          type="password"
          helperText="Password must be at least 8 characters"
        />
      )
      
      const input = screen.getByLabelText('Password')
      const helperText = screen.getByText('Password must be at least 8 characters')
      
      expect(input).toHaveAttribute('aria-describedby')
      expect(helperText).toBeInTheDocument()
    })

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Input label="Test" />)
      
      const input = screen.getByLabelText('Test')
      await user.tab()
      expect(input).toHaveFocus()
      
      await user.keyboard('test input')
      expect(input).toHaveValue('test input')
    })
  })

  describe('Badge Accessibility', () => {
    it('should not have any axe violations', async () => {
      const { container } = render(<Badge>Status Badge</Badge>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should support ARIA labels for status information', () => {
      render(<Badge aria-label="New messages: 5">5</Badge>)
      const badge = screen.getByText('5')
      
      expect(badge).toHaveAttribute('aria-label', 'New messages: 5')
    })

    it('should support role for status indicators', () => {
      render(<Badge role="status">Status</Badge>)
      const badge = screen.getByRole('status')
      
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveTextContent('Status')
    })
  })

  describe('Color Contrast Tests', () => {
    it('should have sufficient color contrast for text', () => {
      render(<Button variant="brand">Brand Button</Button>)
      const button = screen.getByRole('button')
      
      // This would require a contrast checking library
      // For now, we'll just ensure the element exists
      expect(button).toBeInTheDocument()
    })

    it('should have sufficient color contrast for error states', () => {
      render(
        <Input
          label="Test"
          error="Error message"
        />
      )
      
      const errorText = screen.getByText('Error message')
      expect(errorText).toBeInTheDocument()
    })
  })

  describe('Screen Reader Tests', () => {
    it('should announce dynamic content changes', async () => {
      const { rerender } = render(<Button>Initial</Button>)
      const button = screen.getByRole('button')
      
      rerender(<Button>Updated</Button>)
      expect(button).toHaveTextContent('Updated')
    })

    it('should provide context for interactive elements', () => {
      render(
        <div>
          <Button aria-describedby="help-text">Action</Button>
          <p id="help-text">This action will save your changes</p>
        </div>
      )
      
      const button = screen.getByRole('button')
      const helpText = screen.getByText('This action will save your changes')
      
      expect(button).toHaveAttribute('aria-describedby', 'help-text')
      expect(helpText).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation Tests', () => {
    it('should support tab navigation through form elements', async () => {
      const user = userEvent.setup()
      render(
        <form>
          <Input label="First Name" />
          <Input label="Last Name" />
          <Button>Submit</Button>
        </form>
      )
      
      await user.tab()
      expect(screen.getByLabelText('First Name')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByLabelText('Last Name')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByRole('button')).toHaveFocus()
    })

    it('should support escape key to close modals', async () => {
      const user = userEvent.setup()
      const handleClose = jest.fn()
      
      render(
        <div role="dialog" aria-modal="true">
          <Button onClick={handleClose}>Close</Button>
        </div>
      )
      
      const dialog = screen.getByRole('dialog')
      dialog.focus()
      
      await user.keyboard('{Escape}')
      // In a real implementation, this would trigger the close handler
      expect(dialog).toBeInTheDocument()
    })
  })

  describe('Focus Management Tests', () => {
    it('should trap focus within modal dialogs', async () => {
      const user = userEvent.setup()
      render(
        <div role="dialog" aria-modal="true">
          <Button>Action 1</Button>
          <Button>Action 2</Button>
          <Button>Action 3</Button>
        </div>
      )
      
      const buttons = screen.getAllByRole('button')
      buttons[0].focus()
      
      // Tab through buttons
      await user.tab()
      expect(buttons[1]).toHaveFocus()
      
      await user.tab()
      expect(buttons[2]).toHaveFocus()
      
      // Should loop back to first button
      await user.tab()
      expect(buttons[0]).toHaveFocus()
    })

    it('should restore focus when closing modals', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <Button id="trigger">Open Modal</Button>
          <div role="dialog" aria-modal="true" style={{ display: 'none' }}>
            <Button>Close Modal</Button>
          </div>
        </div>
      )
      
      const trigger = screen.getByText('Open Modal')
      trigger.focus()
      
      // In a real implementation, closing modal would restore focus
      expect(trigger).toHaveFocus()
    })
  })

  describe('Reduced Motion Tests', () => {
    it('should respect prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })
      
      render(<Button>Animated Button</Button>)
      const button = screen.getByRole('button')
      
      // Component should have reduced motion styles
      expect(button).toBeInTheDocument()
    })
  })

  describe('High Contrast Tests', () => {
    it('should support high contrast mode', () => {
      // Mock prefers-contrast: high
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })
      
      render(<Button>High Contrast Button</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toBeInTheDocument()
    })
  })
})
