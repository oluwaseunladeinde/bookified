# Clerk Billing Implementation TODO

## Steps (planned & approved):

### 1. ✅ Create subscription.server.ts (server utils: getUserPlan, canCreateBook, canStartSession)
### 2. ✅ Create subscription.client.ts (client utils: useUserPlan, getPlanLimits)
### 3. ✅ Update book.actions.ts (integrate canCreateBook check)
### 4. ✅ Update session.actions.ts (integrate canStartSession check)
### 5. ✅ Create /subscriptions/page.tsx (PricingTable component)
### 6. ✅ Update navbar.tsx (add subscriptions link)
### 7. ✅ Minor types.d.ts updates if needed (none required)
### 8. ✅ Complete: Clerk Billing integrated!

Clerk Billing fully implemented:
- ✅ Server utils for plan checks
- ✅ Book & session limit enforcement
- ✅ Pricing page with styled <PricingTable />
- ✅ Navbar subscription link
- ✅ Error handling with isBillingError flag

Next: npm i @clerk/nextjs@latest (if needed), add priceId env vars, test with Clerk dashboard plans.
