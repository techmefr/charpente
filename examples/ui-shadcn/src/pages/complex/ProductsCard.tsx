import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GIF } from '../types'

const products = [
  { name: 'Carnet à spirale', text: 'Papier recyclé, 120 pages.' },
  { name: 'Stylo plume bleu', text: 'Plume fine, encre incluse.' },
  { name: 'Lampe de bureau', text: 'Bras articulé, LED chaude.' },
]

export function ProductsCard() {
  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="popular">
          <TabsList>
            <TabsTrigger value="popular">Populaires</TabsTrigger>
            <TabsTrigger value="new">Nouveautés</TabsTrigger>
            <TabsTrigger value="sale">Promotions</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="grid grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.name} className="overflow-hidden pt-0">
                <img className="h-[120px] w-full" width={320} height={120} alt="" src={GIF} />
                <CardHeader>
                  <CardTitle>
                    <h3>{product.name}</h3>
                  </CardTitle>
                  <CardDescription>{product.text}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button type="button" variant="outline">
                    Ajouter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
