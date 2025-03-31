import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-light mt-auto border-t border-border py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <p className="font-medium text-foreground">
              &copy; {currentYear} SharedTab. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              Made with <FaHeart className="h-3 w-3 text-primary/80" /> for
              sharing expenses
            </div>
          </div>

          <div className="flex space-x-8">
            <Link
              href="/privacy"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
