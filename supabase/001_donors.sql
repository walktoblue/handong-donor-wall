create table public.donors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  donation_amount bigint not null,
  photo_url text,
  story text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.donors enable row level security;

-- 공개: 활성 후원자만 읽기 (이름 검색)
create policy "public read active" on public.donors
  for select using (is_active = true);

-- 관리자(로그인한 사용자): 전체 읽기
create policy "admin read all" on public.donors
  for select using (auth.uid() is not null);

-- 관리자: 쓰기
create policy "admin insert" on public.donors
  for insert with check (auth.uid() is not null);

create policy "admin update" on public.donors
  for update using (auth.uid() is not null);

create policy "admin delete" on public.donors
  for delete using (auth.uid() is not null);
