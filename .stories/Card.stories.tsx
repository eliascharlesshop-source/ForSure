import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/forsure-card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Flexible card component for grouping related content. Supports multiple variants, interactive states, and customizable padding.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'ghost', 'brand'],
      description: 'Card style variant',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Card padding',
    },
    interactive: {
      control: 'boolean',
      description: 'Enable hover effects',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width card',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a default card with some content inside.</p>
      </CardContent>
    </Card>
  ),
}

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-80">
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card has an elevated appearance with shadow.</p>
      </CardContent>
    </Card>
  ),
}

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="w-80">
      <CardHeader>
        <CardTitle>Outlined Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card has a prominent border outline.</p>
      </CardContent>
    </Card>
  ),
}

export const Brand: Story = {
  render: () => (
    <Card variant="brand" className="w-80">
      <CardHeader>
        <CardTitle>Brand Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card uses brand colors for a distinctive look.</p>
      </CardContent>
    </Card>
  ),
}

export const Interactive: Story = {
  render: () => (
    <Card variant="elevated" interactive className="w-80">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Hover over this card to see the interactive effects.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with hover effects and cursor pointer.',
      },
    },
  },
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card with Footer</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card has a footer section for actions.</p>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <Button size="sm">Cancel</Button>
          <Button size="sm" variant="brand">Save</Button>
        </div>
      </CardFooter>
    </Card>
  ),
}

export const DifferentPaddings: Story = {
  render: () => (
    <div className="space-y-4">
      <Card padding="sm" className="w-80">
        <CardHeader>
          <CardTitle>Small Padding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with small padding.</p>
        </CardContent>
      </Card>
      
      <Card padding="lg" className="w-80">
        <CardHeader>
          <CardTitle>Large Padding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card with large padding for more breathing room.</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different padding options for cards.',
      },
    },
  },
}

export const FullWidth: Story = {
  render: () => (
    <Card fullWidth>
      <CardHeader>
        <CardTitle>Full Width Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card takes the full width of its container.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full width card for layouts.',
      },
    },
  },
}

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
        </CardHeader>
        <CardContent>
          <p>First card in the grid layout.</p>
        </CardContent>
      </Card>
      
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Second card with elevation.</p>
        </CardContent>
      </Card>
      
      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Third card with outline.</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cards in a responsive grid layout.',
      },
    },
  },
}

export const Accessibility: Story = {
  render: () => (
    <Card role="article" aria-labelledby="card-title" className="w-80">
      <CardHeader>
        <CardTitle id="card-title">Accessible Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card includes proper ARIA attributes for screen readers.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with accessibility attributes.',
      },
    },
  },
}

// Import Button for examples
import { Button } from '../components/ui/forsure-button'
