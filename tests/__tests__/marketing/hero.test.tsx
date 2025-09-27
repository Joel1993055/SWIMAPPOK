import Hero from '@/app/marketing/components/sections/hero/default';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the Screenshot component
jest.mock('@/app/marketing/components/ui/screenshot', () => {
  return function MockScreenshot({ alt, ...props }: any) {
    return <img alt={alt} {...props} />;
  };
});

// Mock the Mockup components
jest.mock('@/app/marketing/components/ui/mockup', () => ({
  Mockup: ({ children }: any) => <div data-testid='mockup'>{children}</div>,
  MockupFrame: ({ children, className }: any) => (
    <div data-testid='mockup-frame' className={className}>
      {children}
    </div>
  ),
}));

describe('Hero Component', () => {
  it('renders with default title and description', () => {
    render(<Hero />);

    expect(
      screen.getByText('Advanced Swimming Analytics for Every Coach')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /The most advanced platform to analyze, plan and improve your swimming performance/
      )
    ).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    const customTitle = 'Custom Title';
    const customDescription = 'Custom Description';

    render(<Hero title={customTitle} description={customDescription} />);

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customDescription)).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<Hero />);

    expect(
      screen.getByRole('link', { name: /start free trial/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /view demo/i })
    ).toBeInTheDocument();
  });

  it('renders mockup when provided', () => {
    render(<Hero />);

    expect(screen.getByTestId('mockup-frame')).toBeInTheDocument();
    expect(screen.getByTestId('mockup')).toBeInTheDocument();
  });

  it('hides mockup when set to false', () => {
    render(<Hero mockup={false} />);

    expect(screen.queryByTestId('mockup-frame')).not.toBeInTheDocument();
  });

  it('handles button clicks', async () => {
    const user = userEvent.setup();
    render(<Hero />);

    const startTrialButton = screen.getByRole('link', {
      name: /start free trial/i,
    });
    const viewDemoButton = screen.getByRole('link', { name: /view demo/i });

    expect(startTrialButton).toHaveAttribute('href', '/dashboard');
    expect(viewDemoButton).toHaveAttribute('href', '/preview-dashboard');
  });

  it('renders badge when provided', () => {
    render(<Hero />);

    expect(
      screen.getByText(/new version of swim app pro available/i)
    ).toBeInTheDocument();
  });

  it('hides badge when set to false', () => {
    render(<Hero badge={false} />);

    expect(
      screen.queryByText(/new version of swim app pro available/i)
    ).not.toBeInTheDocument();
  });
});
