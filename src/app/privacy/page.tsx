import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white text-gray-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-50 to-white py-20">
        <div className="absolute -right-40 -top-40 z-0 h-96 w-96 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
        <div className="absolute -left-40 bottom-10 z-0 h-96 w-96 rounded-full bg-indigo-100 opacity-50 blur-3xl"></div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-center text-4xl font-extrabold tracking-tight md:text-5xl">
              Privacy Policy
            </h1>
            <div className="prose prose-lg mx-auto max-w-none">
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Introduction</h2>
                <p className="mb-4 text-gray-600">
                  SharedTab (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;)
                  is committed to protecting your privacy. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your
                  information when you use our expense-sharing application.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">
                  Information We Collect
                </h2>
                <p className="mb-4 text-gray-600">
                  We collect information that you provide directly to us,
                  including:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li className="mb-2">
                    Account information (name, email, password)
                  </li>
                  <li className="mb-2">Group and expense details</li>
                  <li className="mb-2">
                    Payment information for settling expenses
                  </li>
                  <li className="mb-2">Communications with other users</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">
                  How We Use Your Information
                </h2>
                <p className="mb-4 text-gray-600">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li className="mb-2">Provide and maintain our services</li>
                  <li className="mb-2">Process your expense transactions</li>
                  <li className="mb-2">
                    Send you notifications about expenses and settlements
                  </li>
                  <li className="mb-2">Improve and optimize our application</li>
                  <li className="mb-2">
                    Protect against fraudulent or unauthorized transactions
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Data Security</h2>
                <p className="mb-4 text-gray-600">
                  We implement appropriate technical and organizational security
                  measures to protect your information. However, no electronic
                  transmission over the Internet or information storage
                  technology can be guaranteed to be 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">
                  Sharing Your Information
                </h2>
                <p className="mb-4 text-gray-600">
                  We share your information only with:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li className="mb-2">
                    Other group members (only relevant expense information)
                  </li>
                  <li className="mb-2">
                    Service providers who assist in operating our application
                  </li>
                  <li className="mb-2">
                    Legal authorities when required by law
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Your Rights</h2>
                <p className="mb-4 text-gray-600">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li className="mb-2">Access your personal information</li>
                  <li className="mb-2">Correct inaccurate information</li>
                  <li className="mb-2">Request deletion of your information</li>
                  <li className="mb-2">
                    Object to processing of your information
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
                <p className="mb-4 text-gray-600">
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <p className="text-gray-600">Email: privacy@sharedtab.com</p>
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
