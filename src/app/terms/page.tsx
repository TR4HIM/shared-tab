import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="bg-white text-gray-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-50 to-white py-20">
        <div className="absolute -right-40 -top-40 z-0 h-96 w-96 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
        <div className="absolute -left-40 bottom-10 z-0 h-96 w-96 rounded-full bg-indigo-100 opacity-50 blur-3xl"></div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-center text-4xl font-extrabold tracking-tight md:text-5xl">
              Terms of Service
            </h1>
            <div className="prose prose-lg mx-auto max-w-none">
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Agreement to Terms</h2>
                <p className="mb-4 text-gray-600">
                  By accessing or using SharedTab, you agree to be bound by
                  these Terms of Service. If you do not agree to these terms,
                  please do not use our service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">
                  Description of Service
                </h2>
                <p className="mb-4 text-gray-600">
                  SharedTab is an expense-sharing application that allows users
                  to:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li className="mb-2">Create and manage expense groups</li>
                  <li className="mb-2">Track shared expenses</li>
                  <li className="mb-2">Split costs among group members</li>
                  <li className="mb-2">Settle balances between users</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">User Accounts</h2>
                <p className="mb-4 text-gray-600">
                  To use SharedTab, you must:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li className="mb-2">Be at least 18 years old</li>
                  <li className="mb-2">Register with accurate information</li>
                  <li className="mb-2">
                    Maintain the security of your account
                  </li>
                  <li className="mb-2">Notify us of any unauthorized use</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">
                  User Responsibilities
                </h2>
                <p className="mb-4 text-gray-600">You agree to:</p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li className="mb-2">
                    Use the service for lawful purposes only
                  </li>
                  <li className="mb-2">Provide accurate expense information</li>
                  <li className="mb-2">Respect other users&apos; privacy</li>
                  <li className="mb-2">Not misuse or abuse the service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Payment Terms</h2>
                <p className="mb-4 text-gray-600">
                  SharedTab facilitates expense tracking and settlement between
                  users. We are not responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li className="mb-2">
                    Actual monetary transactions between users
                  </li>
                  <li className="mb-2">
                    Disputes between users regarding expenses
                  </li>
                  <li className="mb-2">
                    Failed or incorrect payments between users
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">
                  Limitation of Liability
                </h2>
                <p className="mb-4 text-gray-600">
                  SharedTab is provided &quot;as is&quot; without warranties of
                  any kind. We are not liable for any damages arising from your
                  use of the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Changes to Terms</h2>
                <p className="mb-4 text-gray-600">
                  We reserve the right to modify these terms at any time. We
                  will notify users of any material changes via email or through
                  the application.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Contact Information</h2>
                <p className="mb-4 text-gray-600">
                  For questions about these Terms of Service, please contact us
                  at:
                </p>
                <p className="text-gray-600">Email: terms@sharedtab.com</p>
              </section>

              <div className="mt-12 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
