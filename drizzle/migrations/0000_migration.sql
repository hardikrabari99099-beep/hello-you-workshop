
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- Document store mirroring the original app's collections. Only the server reads/writes it.
create table public.docs (
  collection text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (collection, id)
);
create index docs_collection_idx on public.docs (collection);
grant all on public.docs to service_role;
alter table public.docs enable row level security;

-- Seed default content (plans, blogs, coupons, a payout certificate)
insert into public.docs (collection, id, data) values
('plans','plan-starter', jsonb_build_object('id','plan-starter','name','Starter','account_size',100000,'challenge_fee',4999.0,'original_price',null,'profit_target_points',550,'profit_share',70,'max_loss_limit',20,'min_trading_days',8,'total_trading_days',10,'trades_per_day',3,'description','Perfect for beginners ready to prove their trading skills and take the first step toward funded capital.','features',jsonb_build_array('₹1,00,000 Funded Account','70% Profit Split','Nifty & BankNifty Trading','No segment restriction','Zerodha, Dhan & Angel One','No hidden rules'),'popular',false,'order',1,'created_at','2026-01-01T00:00:00+00:00')),
('plans','plan-standard', jsonb_build_object('id','plan-standard','name','Standard','account_size',200000,'challenge_fee',7999.0,'original_price',null,'profit_target_points',650,'profit_share',70,'max_loss_limit',20,'min_trading_days',10,'total_trading_days',12,'trades_per_day',3,'description','Built for disciplined traders looking to turn consistent strategies into real funded opportunities.','features',jsonb_build_array('₹2,00,000 Funded Account','70% Profit Split','No segment restriction','Scale Up to ₹5,00,000','Zerodha, Dhan & Angel One','No hidden rules'),'popular',false,'order',2,'created_at','2026-01-01T00:00:00+00:00')),
('plans','plan-pro', jsonb_build_object('id','plan-pro','name','Pro','account_size',300000,'challenge_fee',14999.0,'original_price',18999.0,'profit_target_points',750,'profit_share',70,'max_loss_limit',20,'min_trading_days',10,'total_trading_days',12,'trades_per_day',3,'description','Designed for serious traders seeking bigger capital, higher profit potential, and greater flexibility.','features',jsonb_build_array('Account Size ₹3,00,000','70% Profit Split','Scale Up to ₹5,00,000','No segment restriction','15 Trading Days','No hidden rules'),'popular',true,'order',3,'created_at','2026-01-01T00:00:00+00:00')),
('plans','plan-elite', jsonb_build_object('id','plan-elite','name','Elite','account_size',500000,'challenge_fee',14999.0,'original_price',null,'profit_target_points',900,'profit_share',70,'max_loss_limit',20,'min_trading_days',10,'total_trading_days',15,'trades_per_day',3,'description','Our most popular plan. Ideal for disciplined traders ready to scale.','features',jsonb_build_array('Account Size ₹5,00,000','70% Profit Split','No segment restriction','Fund scales to ₹7L','Zerodha/Dhan/Angel One','No hidden rules'),'popular',false,'order',4,'created_at','2026-01-01T00:00:00+00:00')),
('plans','plan-master', jsonb_build_object('id','plan-master','name','Master','account_size',700000,'challenge_fee',19999.0,'original_price',null,'profit_target_points',1000,'profit_share',70,'max_loss_limit',20,'min_trading_days',12,'total_trading_days',15,'trades_per_day',4,'description','Built for pros. Maximum capital, top profit share, full market access.','features',jsonb_build_array('Account Size ₹7,00,000','70% Profit Split','No segment restriction','24hr Payouts','No hidden rules'),'popular',false,'order',5,'created_at','2026-01-01T00:00:00+00:00')),
('coupons','coupon-welcome10', jsonb_build_object('id','coupon-welcome10','code','WELCOME10','discount_percent',10,'active',true,'description','10% off — welcome to IndiFunded','max_uses',null,'used_count',0,'expires_at',null,'created_at','2026-01-01T00:00:00+00:00')),
('coupons','coupon-launch20', jsonb_build_object('id','coupon-launch20','code','LAUNCH20','discount_percent',20,'active',true,'description','20% launch discount','max_uses',500,'used_count',0,'expires_at',null,'created_at','2026-01-01T00:00:00+00:00')),
('coupons','coupon-trader5', jsonb_build_object('id','coupon-trader5','code','TRADER5','discount_percent',5,'active',true,'description','5% off for community traders','max_uses',null,'used_count',0,'expires_at',null,'created_at','2026-01-01T00:00:00+00:00')),
('certificates','cert-seed', jsonb_build_object('id','cert-seed','image_url','/certificates/cert-1.png','trader_name','Vivek Raut','amount',6700,'plan','Starter','account_size',100000,'payout_date','09/05/2026','order',1,'visible',true,'created_at','2026-01-01T00:00:00+00:00')),
('blogs','blog-1', jsonb_build_object('id','blog-1','slug','turn-small-investment-into-profitable-trading','title','Unlock Your Potential: Turn a Small Investment into a Profitable Trading Venture','excerpt','Trading can seem intimidating, especially when considering the challenge fees for a funded account. But with the right approach, a small investment goes a long way.','content',E'Trading can seem intimidating, especially when considering the challenge fees for a funded account. However, it''s important to understand the long-term upside. At IndiFunded, a one-time challenge fee unlocks access to accounts of up to ₹5,00,000 with 70% profit sharing. Start small, prove your discipline, and scale systematically.\n\n**Why it works**\n- Capital efficiency: you keep 70% of profits without risking your own capital beyond the challenge fee.\n- Risk discipline: hard drawdown rules train you to protect capital.\n- Scaling: passing traders see account increments every 2 months up to ₹5L.','cover_image','https://images.unsplash.com/photo-1642790595397-7047dc98fa72?w=1200','author','IndiFunded Team','published',true,'created_at','2026-01-03T00:00:00+00:00')),
('blogs','blog-2', jsonb_build_object('id','blog-2','slug','rise-of-indifunded-indian-trading','title','Uncovering the Rise of IndiFunded: A New Player in the Indian Trading Scene','excerpt','As India''s financial sector expands, traders need platforms built for NSE/BSE. Here''s why IndiFunded is changing the game.','content',E'In today''s fast-paced trading landscape, the right platform can make all the difference for traders. As India''s financial sector expands, IndiFunded has emerged as India''s 1st prop trading firm tailored to NSE stocks, BankNifty, Nifty50 and F&O segments.\n\n**What sets us apart**\n- Rupee-denominated accounts\n- Payouts within 24 hours\n- Integration with Zerodha, Angel One, Dhan, Upstox\n- A community of Indian traders','cover_image','https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200','author','IndiFunded Team','published',true,'created_at','2026-01-02T00:00:00+00:00')),
('blogs','blog-3', jsonb_build_object('id','blog-3','slug','strategies-for-maximizing-profits','title','Strategies for Maximizing Profits with Funded Trading Accounts','excerpt','Fresh methods to boost profits while keeping risk tight. A playbook from IndiFunded''s top traders.','content',E'Traders constantly seek methods to boost profits while keeping risk tight. Here are three proven strategies from our funded traders:\n\n1. **Plan your trading day**: pre-market prep beats reactive trading.\n2. **Respect the loss cap**: 20% max loss isn''t a target, it''s a guardrail — stay well under it.\n3. **Let winners run**: 70% profit accuracy requires fewer losers, not more winners.','cover_image','https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200','author','IndiFunded Team','published',true,'created_at','2026-01-01T00:00:00+00:00'));
