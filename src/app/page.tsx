import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="space-y-16 py-16">

      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold">
          Find Trusted Home Services Near You
        </h1>

        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Browse verified service providers like plumbers, electricians, and
          cleaners in your area.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/providers">
            <Button size="lg">Browse Providers</Button>
          </Link>

          <Link href="/provider/register">
            <Button variant="outline" size="lg">
              Become a Provider
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="font-semibold text-xl">Search Services</h3>
          <p className="text-gray-500">
            Find professionals for plumbing, electrical work, landscaping and more.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-xl">Verified Providers</h3>
          <p className="text-gray-500">
            Admin-reviewed professionals you can trust.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-xl">Easy Contact</h3>
          <p className="text-gray-500">
            Contact providers instantly without creating an account.
          </p>
        </div>
      </section>

    </div>
  )
}