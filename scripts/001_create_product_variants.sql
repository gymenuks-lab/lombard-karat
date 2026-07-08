-- Product variants (sizes for rings, lengths for chains, etc.)
-- Scalable design: a dedicated table linked to products, NOT an array on products.

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  price_adjustment numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_product_size_unique unique (product_id, size)
);

-- Fast lookup of all variants for a product.
create index if not exists idx_product_variants_product_id
  on public.product_variants (product_id);

-- Keep updated_at fresh on updates.
create or replace function public.set_product_variants_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_product_variants_updated_at on public.product_variants;
create trigger trg_product_variants_updated_at
  before update on public.product_variants
  for each row
  execute function public.set_product_variants_updated_at();

-- Row Level Security: variants are publicly readable (like published products);
-- all writes happen server-side through the service-role client (bypasses RLS).
alter table public.product_variants enable row level security;

drop policy if exists "product_variants_public_read" on public.product_variants;
create policy "product_variants_public_read"
  on public.product_variants
  for select
  using (true);
