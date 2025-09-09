import { BarChart3, Menu } from 'lucide-react';
import { ReactNode } from 'react';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

import { Button, type ButtonProps } from '../../ui/button';
import {
    Navbar as NavbarComponent,
    NavbarLeft,
    NavbarRight,
} from '../../ui/navbar';
import Navigation from '../../ui/navigation';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';

interface NavbarLink {
  text: string;
  href: string;
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: ButtonProps['variant'];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
  className?: string;
}

export default function Navbar({
  logo = <BarChart3 className='w-8 h-8 text-white' />,
  name = 'Swim:APP',
  homeUrl = siteConfig.url,
  mobileLinks = [
    { text: 'Getting Started', href: siteConfig.url },
    { text: 'Components', href: siteConfig.url },
    { text: 'Documentation', href: siteConfig.url },
  ],
  actions = [
    { text: 'Sign in', href: siteConfig.url, isButton: false },
    {
      text: 'Get Started',
      href: siteConfig.url,
      isButton: true,
      variant: 'default',
    },
  ],
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  return (
    <header className={cn('sticky top-0 z-50 -mb-4 px-4 pb-4', className)}>
      <div className='fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg'></div>
      <div className='max-w-container relative mx-auto'>
        <NavbarComponent>
          <NavbarLeft>
            <a
              href={homeUrl}
              className='flex items-center gap-2 text-xl font-bold'
            >
              {logo}
              {name}
            </a>
            {showNavigation && (customNavigation || <Navigation />)}
          </NavbarLeft>
          <NavbarRight>
            {/* Enlaces de navegación - Desktop */}
            <nav className='flex items-center gap-8'>
              {mobileLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
                >
                  {link.text}
                </a>
              ))}
            </nav>

            {/* Botones de acción - Desktop */}
            <div className='flex items-center gap-4'>
              <a
                href='/auth/signin'
                className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
              >
                Sign in
              </a>
              <Button asChild>
                <a href='/auth/signup'>Get Started</a>
              </Button>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='shrink-0 md:hidden'
                >
                  <Menu className='size-5' />
                  <span className='sr-only'>Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='right'>
                <nav className='grid gap-6 text-lg font-medium'>
                  <a
                    href={homeUrl}
                    className='flex items-center gap-2 text-xl font-bold'
                  >
                    <span>{name}</span>
                  </a>
                  {mobileLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className='text-muted-foreground hover:text-foreground'
                    >
                      {link.text}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
