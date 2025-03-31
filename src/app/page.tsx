import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import {
  FaArrowRight,
  FaChartLine,
  FaMoneyBillWave,
  FaUsers,
  FaWallet,
} from 'react-icons/fa';

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-24 md:py-32">
        <div className="absolute -right-40 -top-40 z-0 h-96 w-96 rounded-full bg-blue-100 opacity-40 blur-3xl"></div>
        <div className="absolute -left-40 bottom-10 z-0 h-96 w-96 rounded-full bg-indigo-100 opacity-40 blur-3xl"></div>
        <div className="dotted-bg absolute inset-0 z-0 opacity-20"></div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-foreground">Split expenses,</span>
              <span className="gradient-text"> not friendships</span>
            </h1>
            <p className="mb-10 text-xl text-muted-foreground">
              The simplest way to share expenses with friends, roommates, and
              groups. Track debts, settle payments, and keep your financial
              relationships healthy.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild variant="gradient" size="lg" className="group">
                <Link href="/groups">
                  Get Started
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden bg-gradient-to-tr from-blue-50 to-white py-24">
        <div className="absolute left-1/2 top-0 h-[1px] w-1/3 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.9),transparent)] opacity-70"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Features</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Designed to make expense sharing simple, fair, and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <Card variant="glass" className="group">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <FaWallet className="text-xl" />
                </div>
                <CardTitle>Track Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Easily record and categorize expenses. Know where your money
                  is going.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card variant="glass" className="group">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <FaUsers className="text-xl" />
                </div>
                <CardTitle>Group Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create groups for trips, roommates, or recurring expenses with
                  friends.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card variant="glass" className="group">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <FaMoneyBillWave className="text-xl" />
                </div>
                <CardTitle>Split Fairly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Split expenses equally or customize amounts for each person.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card variant="glass" className="group">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <FaChartLine className="text-xl" />
                </div>
                <CardTitle>Settlement Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See who owes what and mark expenses as settled when paid.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative bg-gradient-to-b from-white to-blue-50 py-28">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_0.5px,transparent_0.5px)] opacity-5 [background-size:16px_16px]"></div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="relative z-10 mb-4 text-3xl font-bold md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Three simple steps to manage your shared expenses.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Line connector (only visible on md+) */}
            <div className="left-1/6 right-1/6 absolute top-16 hidden h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 md:block"></div>

            {/* Step 1 */}
            <Card variant="interactive" className="overflow-hidden border-0">
              <CardHeader className="flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 transform items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-md transition-transform group-hover:scale-105">
                  1
                </div>
                <CardTitle className="text-center">Create a Group</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Start by creating a group for your roommates, trip, or event.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card variant="interactive" className="overflow-hidden border-0">
              <CardHeader className="flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 transform items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-md transition-transform group-hover:scale-105">
                  2
                </div>
                <CardTitle className="text-center">Log Expenses</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Add expenses and specify who paid and how to split the cost.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card variant="interactive" className="overflow-hidden border-0">
              <CardHeader className="flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 transform items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-md transition-transform group-hover:scale-105">
                  3
                </div>
                <CardTitle className="text-center">Settle Up</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  See who owes what and mark expenses as settled when paid.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="glass-light relative overflow-hidden py-24 text-foreground">
        <div className="absolute left-0 top-0 z-0 h-full w-full opacity-20 [background-size:20px_20px] [background:radial-gradient(#4338ca_1px,transparent_1px)]"></div>
        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to simplify your expense sharing?
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground">
            Join SharedTab today and take the stress out of shared finances.
          </p>
          <Button asChild variant="modern" size="lg" className="group">
            <Link href="/groups">
              Get Started Now
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
