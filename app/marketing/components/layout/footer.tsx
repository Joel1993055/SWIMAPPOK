import { Facebook, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const navigation = [
  {
    title: 'Product',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Features', href: '/features' },
      { name: 'Blog', href: '/blog' },
      { name: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Faq', href: '/faq' },
      { name: 'Contact', href: '/contact' },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com' },
  { icon: Twitter, href: 'https://twitter.com' },
  { icon: Linkedin, href: 'https://linkedin.com' },
];

const legal = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Cookie Settings', href: '/cookie-policy' },
  { name: 'Terms of Service', href: '/terms' },
];

export const Footer = () => {
  return (
    <footer className="bg-obsidian text-foreground px-2.5 lg:px-0">
      <div className="container p-0">
        <div className="bg-jet border-dark-gray grid border-r border-l p-0 lg:grid-cols-3">
          {navigation.map((section) => (
            <div
              key={section.title}
              className="lg:border-r-dark-gray border-b-dark-gray border-r-0 border-b px-6 py-10 lg:border-r lg:px-8 lg:py-12"
            >
              <h3 className="mb-4 text-2xl font-bold">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-muted-foreground transition-colors lg:text-lg"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="border-b-dark-gray border-b px-6 py-10 lg:px-8 lg:py-12">
            <div className="flex items-center gap-6 lg:justify-end">
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={link.href}
                  className="hover:text-muted-foreground transition-colors"
                >
                  <link.icon size={24} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-jet border-dark-gray grid border-r border-b border-l lg:grid-cols-2">
          <div className="border-b-dark-gray flex flex-col justify-center border-b px-6 py-10 lg:max-w-md lg:border-b-0 lg:px-8 lg:py-12">
            <div className="max-w-md">
              <p className="text-foreground text-sm">Regulatory disclaimer</p>
              <p className="font-inter-tight text-mid-gray text-xs">
                DECKapp is a swimming technology company, not a bank. Swimming
                services are provided by partner institutions and are
                professionally managed.
              </p>
            </div>
          </div>
          <div className="flex justify-end px-6 py-10 lg:px-8 lg:py-12">
            <Image
              src="/DECKapp.svg"
              alt="DECKapp logo"
              width={320}
              height={80}
              className="invert dark:invert-0"
            />
          </div>
        </div>
        <div className="bg-jet border-dark-gray grid gap-2 border-r border-l px-6 py-4 sm:grid-cols-2 lg:px-8">
          <div>
            <p className="text-foreground text-xs">@ 2025 DECKapp.com</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            {legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-muted-foreground text-xs underline"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
