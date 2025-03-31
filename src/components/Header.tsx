'use client';

import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const routes = [{ name: 'Groups', path: '/groups' }];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="glass sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex flex-shrink-0 items-center transition-all duration-300 hover:opacity-80"
            >
              <Image
                src="/SharedTab.svg"
                alt="SharedTab Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="font-bold text-primary">SharedTab</span>
            </Link>
          </div>

          {/* Move the menu to the right and center items vertically */}
          <nav className="hidden items-center justify-end md:ml-4 md:flex md:space-x-8">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`${
                  isActive(route.path)
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                } relative px-3 py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full`}
              >
                {route.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-5 w-5`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-5 w-5`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden transition-all duration-300 ease-in-out md:hidden`}
      >
        <div className="space-y-2 px-4 pb-4 pt-2">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`${
                isActive(route.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
              } block rounded-md px-3 py-2 text-base font-medium transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              {route.name}
            </Link>
          ))}
          <Button variant="modern" size="sm" className="mt-4 w-full" asChild>
            <Link href="/groups" onClick={() => setIsMenuOpen(false)}>
              New Group
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
