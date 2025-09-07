import Features from '@/app/marketing/components/sections/features/default'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

describe('Features Component', () => {
  it('renders with default title and description', () => {
    render(<Features />)
    
    expect(screen.getByText('Make the right impression')).toBeInTheDocument()
    expect(screen.getByText(/Launch UI makes it easy to build an unforgettable website/)).toBeInTheDocument()
  })

  it('renders all three tabs', () => {
    render(<Features />)
    
    expect(screen.getByText('Choose your sections')).toBeInTheDocument()
    expect(screen.getByText('Add your content')).toBeInTheDocument()
    expect(screen.getByText('Customize')).toBeInTheDocument()
  })

  it('shows first tab as active by default', () => {
    render(<Features />)
    
    const firstTab = screen.getByText('Choose your sections').closest('div')
    expect(firstTab).toHaveClass('bg-[#141414]')
  })

  it('allows switching between tabs', async () => {
    const user = userEvent.setup()
    render(<Features />)
    
    const secondTab = screen.getByText('Add your content').closest('div')
    const thirdTab = screen.getByText('Customize').closest('div')
    
    // Click second tab
    await user.click(secondTab!)
    expect(secondTab).toHaveClass('bg-[#141414]')
    
    // Click third tab
    await user.click(thirdTab!)
    expect(thirdTab).toHaveClass('bg-[#141414]')
    expect(secondTab).not.toHaveClass('bg-[#141414]')
  })

  it('renders dashboard image', () => {
    render(<Features />)
    
    const dashboardImage = screen.getByAltText('Dashboard preview')
    expect(dashboardImage).toBeInTheDocument()
    expect(dashboardImage).toHaveAttribute('src', '/dashboard-light.png')
  })

  it('renders glow effect behind dashboard', () => {
    render(<Features />)
    
    const glowElement = document.querySelector('[style*="radial-gradient"]')
    expect(glowElement).toBeInTheDocument()
  })

  it('has proper tab descriptions', () => {
    render(<Features />)
    
    expect(screen.getByText(/Choose among 100\+ components to build a landing page/)).toBeInTheDocument()
    expect(screen.getByText(/Fill the blanks with screenshots, videos, and other content/)).toBeInTheDocument()
    expect(screen.getByText(/Make design yours in no time by changing the variables/)).toBeInTheDocument()
  })

  it('has proper tab icons', () => {
    render(<Features />)
    
    expect(screen.getByText('📑')).toBeInTheDocument()
    expect(screen.getByText('✏️')).toBeInTheDocument()
    expect(screen.getByText('⚙️')).toBeInTheDocument()
  })
})
