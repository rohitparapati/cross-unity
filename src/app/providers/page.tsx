import { providers } from "@/lib/data/providers"
import ProviderCard from "@/components/providers/provider-card"

export default function ProvidersPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-6">Service Providers</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  )
}