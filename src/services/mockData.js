export const dashboardByRole = {
  ADMIN: {
    stats: [
      { label: 'Total Properties', value: 84 },
      { label: 'Total Units', value: 542 },
      { label: 'Occupied Units', value: 488 },
      { label: 'Overdue Rent Count', value: 37 },
    ],
    revenue: 456200,
    recentActivity: [
      'Unit B-204 marked occupied in Skyline Heights',
      'Payment failed for Tenant #T-219',
      'New property added in Miami',
      'Complaint closed for Unit C-105',
    ],
  },
  OWNER: {
    stats: [
      { label: 'My Units', value: 32 },
      { label: 'Active Tenants', value: 29 },
      { label: 'Rent Summary', value: '$41,500' },
      { label: 'Maintenance Summary', value: '7 Open Tickets' },
    ],
    paymentHistory: [
      { month: 'Oct', amount: 11800 },
      { month: 'Nov', amount: 12600 },
      { month: 'Dec', amount: 13400 },
      { month: 'Jan', amount: 14300 },
      { month: 'Feb', amount: 15100 },
    ],
  },
  TENANT: {
    unit: {
      unitNo: 'A-303',
      building: 'Palm Crest Residency',
      rentStatus: 'PAID',
      dueDate: '2026-03-05',
    },
    communication: [
      'Rent reminder sent via Email',
      'Maintenance ticket #M-332 resolved',
      'Move-in policy update via WhatsApp',
    ],
  },
}

export const propertiesSeed = [
  { id: 1, name: 'Skyline Heights', city: 'New York', type: 'Apartment', status: 'ACTIVE', units: 64 },
  { id: 2, name: 'Palm Crest Residency', city: 'Miami', type: 'Building', status: 'ACTIVE', units: 32 },
  { id: 3, name: 'Maple Business Hub', city: 'Chicago', type: 'PG', status: 'INACTIVE', units: 18 },
  { id: 4, name: 'Rivera Studio Park', city: 'Austin', type: 'Apartment', status: 'ACTIVE', units: 40 },
]

export const unitsSeed = [
  { id: 1, unitNo: 'A-101', property: 'Skyline Heights', owner: 'Ava Brooks', floor: 1, status: 'AVAILABLE' },
  { id: 2, unitNo: 'A-303', property: 'Palm Crest Residency', owner: 'Noah Blake', floor: 3, status: 'OCCUPIED' },
  { id: 3, unitNo: 'C-109', property: 'Maple Business Hub', owner: 'Liam Ray', floor: 1, status: 'INACTIVE' },
  { id: 4, unitNo: 'D-411', property: 'Rivera Studio Park', owner: 'Olivia Stone', floor: 4, status: 'AVAILABLE' },
]

export const rentsSeed = [
  { id: 1, tenant: 'Mia Johnson', unit: 'A-303', dueDate: '2026-02-05', amount: 1800, status: 'PAID' },
  { id: 2, tenant: 'Ethan Clarke', unit: 'A-101', dueDate: '2026-02-05', amount: 1450, status: 'OVERDUE' },
  { id: 3, tenant: 'Sophia Reed', unit: 'D-411', dueDate: '2026-02-10', amount: 1600, status: 'PAID' },
]

export const monthlyRentSeries = [
  { month: 'Sep', value: 35200 },
  { month: 'Oct', value: 37120 },
  { month: 'Nov', value: 39300 },
  { month: 'Dec', value: 41200 },
  { month: 'Jan', value: 43200 },
  { month: 'Feb', value: 42100 },
]

export const paymentsSeed = [
  { id: 5001, tenant: 'Mia Johnson', amount: 1800, date: '2026-02-03', status: 'SUCCESS', method: 'CARD' },
  { id: 5002, tenant: 'Ethan Clarke', amount: 1450, date: '2026-02-04', status: 'FAILED', method: 'BANK_TRANSFER' },
  { id: 5003, tenant: 'Sophia Reed', amount: 1600, date: '2026-02-10', status: 'PENDING', method: 'UPI' },
]

export const maintenanceSeed = [
  { id: 1, unit: 'A-303', issue: 'Water leakage', dueDate: '2026-02-21', status: 'IN_PROGRESS', paid: false },
  { id: 2, unit: 'A-101', issue: 'Lift servicing', dueDate: '2026-02-24', status: 'OPEN', paid: false },
  { id: 3, unit: 'D-411', issue: 'HVAC tune-up', dueDate: '2026-02-16', status: 'CLOSED', paid: true },
]

export const complaintSeed = [
  { id: 9001, title: 'Power outage in corridor', description: 'Second floor lights are off nightly.', status: 'OPEN', createdAt: '2026-02-12T10:20:00Z' },
  { id: 9002, title: 'Noise complaint', description: 'Late-night noise from adjacent unit.', status: 'IN_PROGRESS', createdAt: '2026-02-13T08:40:00Z' },
  { id: 9003, title: 'Parking slot blocked', description: 'Unauthorized vehicle in slot A-15.', status: 'CLOSED', createdAt: '2026-02-15T09:30:00Z' },
]

export const damageReportsSeed = [
  {
    id: 1,
    property: 'Palm Crest Residency',
    unit: 'A-303',
    floor: 3,
    tenantEmail: 'tenant@renterz.com',
    beforeImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=400&q=70',
    afterImage: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=400&q=70',
    estimatedCost: 2300,
    status: 'IN_PROGRESS',
  },
  {
    id: 2,
    property: 'Rivera Studio Park',
    unit: 'D-411',
    floor: 4,
    tenantEmail: 'someone@example.com',
    beforeImage: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=400&q=70',
    afterImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=70',
    estimatedCost: 900,
    status: 'CLOSED',
  },
]

export const communicationSeed = [
  { id: 1, channel: 'EMAIL', templateName: 'Rent Reminder v2', deliveryStatus: 'SUCCESS', timestamp: '2026-02-12T08:15:00Z', message: 'Your rent due date is approaching.' },
  { id: 2, channel: 'SMS', templateName: 'Payment Failure Alert', deliveryStatus: 'FAILED', timestamp: '2026-02-13T11:45:00Z', message: 'Payment failed. Please retry.' },
  { id: 3, channel: 'WHATSAPP', templateName: 'Maintenance Update', deliveryStatus: 'SUCCESS', timestamp: '2026-02-15T17:10:00Z', message: 'Maintenance request has been completed.' },
  { id: 4, channel: 'VOICE', templateName: 'Urgent Overdue Follow-up', deliveryStatus: 'PENDING', timestamp: '2026-02-16T09:00:00Z', message: 'Automated call scheduled for overdue reminder.' },
]
