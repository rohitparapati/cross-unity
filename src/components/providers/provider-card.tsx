import { Provider } from "@/lib/types/provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Props = {
  provider: Provider
}

export default function ProviderCard({ provider }: Props) {
  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {provider.name}
          {provider.verified && <Badge>Verified</Badge>}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-gray-500">{provider.category}</p>

        <p className="text-sm">{provider.description}</p>

        <p className="text-sm font-medium">⭐ {provider.rating}</p>

        <Button className="w-full">View Profile</Button>
      </CardContent>
    </Card>
  )
}