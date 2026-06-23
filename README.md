# Menu-To-Table

A premium SaaS platform for private chefs — private dinners, weekly meal prep, and cooking classes with tiered menu proposals.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma ORM**
- **PostgreSQL**

## Getting Started

```bash
npm install
cp .env.example .env
# Set DATABASE_URL

npx prisma db push
npm run db:seed
npm run dev
```

### Schema migration (existing database)

If upgrading from the previous schema, reset the dev database:

```bash
npx prisma db push --force-reset
npm run db:seed
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Editorial landing page |
| `/dashboard` | Chef CRM — service toggles, bookings, proposals |
| `/intake/[chefId]` | Multi-step client intake (service → details → requirements) |
| `/proposal/[eventId]` | Tiered menu proposal with tier selection & deposit |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/intake` | Dynamic client intake by service type |
| `POST` | `/api/proposals` | Create tiered menu proposal |
| `PATCH` | `/api/proposals/[id]/select-tier` | Client selects a tier |
| `GET` | `/api/events?chefId=&serviceType=` | Dashboard bookings |
| `GET/PATCH` | `/api/events/[id]` | Event details / mark paid |
| `GET/PATCH` | `/api/chef/[id]` | Chef profile / active services |

## Data Model

- **Chef** — profile, active service offerings
- **Client** — contact info
- **Event** — booking with `serviceType`, `status`, `intakeData` (JSON)
- **MenuProposal** — chef notes, proposal status
- **ProposalTier** — Classic / Signature / Executive tiers with menu items (JSON)
