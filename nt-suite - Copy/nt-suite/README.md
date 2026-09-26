# NT/OS — Full-Stack Work Suite

A real, self-hosted business suite: **Express + Prisma + SQLite** backend, **React + Vite** frontend.
Designed after the Nothing Phone visual language (dot-matrix display type, dashed borders, transparent
glyph panels) and architected the way Odoo itself is — every module hangs off one shared **Contacts**
model, so a lead, a sales order, an invoice, and a support ticket can all point at the same customer.

This is a genuine running application with a real database, real authentication, and real API calls —
not a mockup. Run it locally, inspect the data in Prisma Studio, and extend it module by module.

## What's included

| Module | Status | Notes |
|---|---|---|
| Auth | ✅ Full | JWT, bcrypt password hashing, register/login |
| Dashboard | ✅ Full | Live KPIs pulled from every module |
| Contacts | ✅ Full | The hub model — customers & vendors |
| CRM | ✅ Full | Drag-and-drop pipeline, lead creation |
| Sales | ✅ Full | Multi-line orders, status flow (draft → confirmed → shipped) |
| Purchase | ✅ Full | Vendor POs — receiving a PO auto-restocks inventory |
| Invoicing | ✅ Full | Invoice creation, payment recording |
| Inventory | ✅ Full | Products, stock adjustments, stock-move ledger, low-stock alerts |
| Projects | ✅ Full | Multi-project task kanban |
| Timesheets | ✅ Full | Time logging against tasks |
| HR | ✅ Full | Employees, departments, leave requests with approval flow |
| Helpdesk | ✅ Full | Support tickets, priority & status |
| Calendar | ✅ Full | Month view, event creation |
| Knowledge | ✅ Full | Wiki-style articles |
| Documents | ✅ Full | Real file upload/download to disk |
| Command palette | ✅ Extra | ⌘K — jump to any module or search live data |
| Notifications | ✅ Extra | In-app notification center |

**Not included, by design:** the deeper Odoo apps (Manufacturing/BOM, Website builder, eCommerce storefront,
Email Marketing automation, e-Signature, Field Service, Subscriptions billing, AI). Replicating those at real
depth is its own multi-week project each. The architecture here (Prisma model + route file + page) is set up
so you — or I, in a follow-up — can add any of them the same way the existing modules were built. See
"Extending it" below.

## Requirements

- Node.js 18+ (you're on 22, that's fine)
- No external database needed — SQLite ships as a local file

## Setup

```bash
# 1. Unzip and enter the project
cd nt-suite

# 2. Install both apps
npm run install:all

# 3. Create the database (generates prisma/dev.db from the schema)
npm run db:push

# 4. Load demo data (contacts, leads, orders, invoices, employees...)
npm run seed

# 5. Run both servers together
npm run dev
```

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

Log in with the seeded demo account:

```
Email:    admin@ntos.dev
Password: demo1234
```

Or click **Create one** on the login screen to make your own account — the first registered user
automatically becomes an admin.

## Project structure

```
nt-suite/
├─ server/                  Express API
│  ├─ prisma/
│  │  ├─ schema.prisma      All 22 models — the single source of truth
│  │  └─ seed.js            Demo data loader
│  └─ src/
│     ├─ index.js           App entry — wires up every route module
│     ├─ middleware/auth.js JWT verification
│     ├─ routes/            One file per module (crm.js, sales.js, hr.js...)
│     └─ utils/notify.js    Shared helpers
└─ client/                  React app
   └─ src/
      ├─ components/        Layout, Kanban, Modal, CommandPalette, DotIcon...
      ├─ context/           Auth + Toast state
      ├─ lib/api.js         Fetch wrapper with JWT attached
      └─ pages/             One file per module, matches the sidebar 1:1
```

## Useful commands

```bash
npm run db:push --prefix server     # apply schema changes to the SQLite file
npm run db:studio --prefix server   # open Prisma Studio — a GUI to browse/edit the database
npm run seed                        # wipe and reseed demo data
```

## Extending it (adding a new Odoo-style module)

Say you want to add **Manufacturing**:

1. **Schema** — add `BillOfMaterial` and `ManufacturingOrder` models to `server/prisma/schema.prisma`,
   then `npm run db:push --prefix server`.
2. **Route** — create `server/src/routes/manufacturing.js` following the pattern in `inventory.js`
   (list, create, update endpoints using `prisma.manufacturingOrder...`). Register it in `src/index.js`.
3. **Page** — create `client/src/pages/Manufacturing.jsx` following `Purchase.jsx` as a template.
4. **Nav** — add one entry to the `NAV` array in `client/src/components/Layout.jsx` and to
   `TITLES`; add a dot-icon pattern in `DotIcon.jsx`.

That's the same four-step pattern every existing module follows — nothing hidden or magic.

## Design notes

- Color and type tokens live in `client/src/index.css` as CSS variables (`--bg`, `--red`, `--ink`, etc.),
  so retheming is a find-and-replace of a handful of hex values, not a rewrite.
- The dot-grid icons in the sidebar are generated from a 4×4 boolean matrix per icon in `DotIcon.jsx` —
  add a new module's icon by sketching its pattern in that grid.
- Auth token is stored in `localStorage`; for a production deployment behind HTTPS, consider moving to an
  httpOnly cookie instead.
