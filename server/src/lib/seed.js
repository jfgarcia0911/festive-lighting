// Sample leads shown when no leads file exists yet (e.g. a fresh deploy on a
// host with an ephemeral filesystem). As soon as a real lead is submitted, it's
// appended and persisted alongside these — so the dashboard is never empty in a
// demo. Local dev with an existing data/leads.json ignores this.
export const SEED_LEADS = [
  {
    id: '7c1f0a2e-0001-4a10-9e10-aa0000000001',
    name: 'Emily Carter',
    email: 'emily.carter@example.com',
    phone: '(973) 555-0142',
    address: '24 Maplewood Ave, Maplewood, NJ',
    pkg: 'premium',
    feet: 160,
    estimate: 2880,
    message: 'Want the full roofline plus the two front trees wrapped.',
    receivedAt: '2026-06-08T15:42:00.000Z',
  },
  {
    id: '7c1f0a2e-0002-4a10-9e10-aa0000000002',
    name: 'David Thompson',
    email: 'dthompson@example.com',
    phone: '(214) 555-0198',
    address: '1809 Lakeshore Dr, Frisco, TX',
    pkg: 'permanent',
    feet: 210,
    estimate: 6300,
    message: 'Interested in year-round programmable eaves I can control from my phone.',
    receivedAt: '2026-06-05T19:10:00.000Z',
  },
  {
    id: '7c1f0a2e-0003-4a10-9e10-aa0000000003',
    name: 'Sarah Nguyen',
    email: 'sarah.nguyen@example.com',
    phone: '(630) 555-0173',
    address: '512 Brookdale Ln, Naperville, IL',
    pkg: 'classic',
    feet: 120,
    estimate: 1440,
    message: 'Just the front of the house for the holidays.',
    receivedAt: '2026-05-30T22:05:00.000Z',
  },
  {
    id: '7c1f0a2e-0004-4a10-9e10-aa0000000004',
    name: 'Lakeside Plaza (Mgmt Office)',
    email: 'ops@lakesideplaza.example.com',
    phone: '(480) 555-0120',
    address: '7400 E Shea Blvd, Scottsdale, AZ',
    pkg: 'commercial',
    feet: 0,
    estimate: 0,
    message: 'Storefront row + main entrance for the holiday season, roughly 400 ft.',
    receivedAt: '2026-05-22T17:30:00.000Z',
  },
]
