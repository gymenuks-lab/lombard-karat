-- Persist the chosen variant (e.g. ring size) on each order.
alter table public.orders
  add column if not exists product_size text;

alter table public.orders
  add column if not exists product_variant_id uuid references public.product_variants(id) on delete set null;

create index if not exists idx_orders_product_variant_id
  on public.orders (product_variant_id);
