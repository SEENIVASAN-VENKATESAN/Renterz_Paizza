import { useState } from 'react'
import { useForm } from 'react-hook-form'
import FormField from '../../components/forms/FormField'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import StatusBadge from '../../components/ui/StatusBadge'
import { usePageLoading } from '../../hooks/usePageLoading'
import { complaintSeed } from '../../services/mockData'
import { formatDateTime } from '../../utils/formatters'

export default function ComplaintPage() {
  const loading = usePageLoading(350)
  const [complaints, setComplaints] = useState(complaintSeed)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange', defaultValues: { title: '', description: '' } })

  const onSubmit = (values) => {
    setComplaints((prev) => [
      {
        id: Date.now(),
        title: values.title,
        description: values.description,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
    reset()
  }

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-5">
        <Skeleton className="h-80 lg:col-span-2" />
        <Skeleton className="h-80 lg:col-span-3" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <h2 className="text-xl font-bold">Raise Complaint</h2>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Title" error={errors.title?.message}>
            <input {...register('title', { required: 'Title is required' })} className="input-base" />
          </FormField>
          <FormField label="Description" error={errors.description?.message}>
            <textarea {...register('description', { required: 'Description is required' })} rows="4" className="input-base" />
          </FormField>
          <Button type="submit" disabled={!isValid}>Submit Complaint</Button>
        </form>
      </Card>

      <Card className="lg:col-span-3">
        <h3 className="text-lg font-semibold">Complaint Timeline</h3>
        <div className="mt-4 space-y-3">
          {complaints.map((item) => (
            <div key={item.id} className="rounded-xl border border-base p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-main">{item.title}</p>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-1 text-sm text-soft">{item.description}</p>
              <p className="mt-2 text-xs text-soft">{formatDateTime(item.createdAt)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}