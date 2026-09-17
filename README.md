## Getting Started

Run the development server:

```bash
npm ci
npm run dev
```

## Shipper prototype

Open `/shipper` for the responsive customer cabinet. It uses local demo data;
no backend, live GPS, payment processing or background scheduler is connected.
`/cargo` and the bus interfaces retain their existing layouts.

Demo scenarios include `JL-2049` (proposal), `JL-2045` (delay and surcharge),
`JL-2042` (delivery confirmation), and `JL-2047` (warehouse shipment).
Use invitation `NOMAD-DEMO` to connect the third company.
Reset data and locally stored photos in **Профиль → Сбросить демоданные**.

Checks:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Browser acceptance: create an order without weight/dimensions, accept a proposal,
decline a surcharge, attach/reopen an issue photo after reload, reserve warehouse
stock and cancel the shipment, launch/pause a recurring supply, connect a company,
and edit the profile. Check all pages at 320, 768, 1024 and 1440 px.
