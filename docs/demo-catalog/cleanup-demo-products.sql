-- ============================================================================
-- DEMO CATALOG: повне видалення демо-товарів
-- Видаляє ТІЛЬКИ рядки з telegram_message_id < 0. Реальні товари (додатні id
-- з Telegram, а також створені вручну без id) не чіпаються.
-- ============================================================================

-- ШАГ 1 (тільки читання): що буде видалено.
select id, title, status, is_published, telegram_message_id
from public.products
where telegram_message_id < 0
order by telegram_message_id desc;

-- ШАГ 2 (тільки читання): чи є заявки, прив'язані до демо-товарів.
-- Якщо count > 0 — вирішіть окремо, що робити із цими заявками, і не видаляйте наосліп.
select count(*) as orders_for_demo_products
from public.orders
where product_id in (select id from public.products where telegram_message_id < 0);

-- ШАГ 3: видалення (розкоментуйте після перевірки кроків 1–2).
-- Варіанти product_variants видаляються каскадно (on delete cascade).
-- delete from public.products where telegram_message_id < 0;
