import Card from './Card'

export default function StatCard({ title, value, accent = 'bg-teal-500' }) {
  return (
    <Card className="relative overflow-hidden">
      <span className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 ${accent}`} />
      <p className="text-sm text-soft">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-main">{value}</h3>
    </Card>
  )
}