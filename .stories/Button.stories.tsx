import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button } from '../components/ui/forsure-button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states. Supports loading indicators, icons, and full accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'brand', 'outline', 'ghost', 'link', 'destructive', 'brandOutline'],
      description: 'Button style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'icon', 'smIcon', 'lgIcon'],
      description: 'Button size',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
  },
  args: {
    onClick: fn(),
    children: 'Button',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default Button',
  },
}

export const Brand: Story = {
  args: {
    variant: 'brand',
    children: 'Brand Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different button sizes for various use cases.',
      },
    },
  },
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button leftIcon={<PlusIcon />}>Add Item</Button>
      <Button rightIcon={<ArrowRightIcon />}>Continue</Button>
      <Button loading>Loading...</Button>
      <Button size="icon" leftIcon={<SearchIcon />} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with icons for better visual communication.',
      },
    },
  },
}

export const LoadingStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button loading>Loading...</Button>
      <Button variant="brand" loading>Processing...</Button>
      <Button variant="outline" loading>Please Wait</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading states with animated spinners.',
      },
    },
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled>Disabled</Button>
      <Button variant="brand" disabled>Disabled Brand</Button>
      <Button variant="outline" disabled>Disabled Outline</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled button states.',
      },
    },
  },
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Full width button for forms and CTAs.',
      },
    },
  },
}

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <Button aria-label="Add new item">Add Item</Button>
      <Button aria-describedby="button-help">Help Button</Button>
      <p id="button-help" className="text-sm text-muted-foreground">
        This button provides help for the current page.
      </p>
      <Button disabled aria-disabled="true">Disabled with ARIA</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features including ARIA labels and descriptions.',
      },
    },
  },
}

export const Interactive: Story = {
  render: () => {
    const [count, setCount] = React.useState(0)
    
    return (
      <div className="space-y-4">
        <p>Count: {count}</p>
        <Button onClick={() => setCount(count + 1)}>Increment</Button>
        <Button variant="outline" onClick={() => setCount(0)}>Reset</Button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive button with state management.',
      },
    },
  },
}

// Icon components
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
