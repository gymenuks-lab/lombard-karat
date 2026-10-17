-- ============================================================================
-- DEMO CATALOG: seed (6 demo products)
-- ----------------------------------------------------------------------------
-- Запускати вручну в Supabase → SQL Editor. НЕ є міграцією, схему не змінює.
-- Усі значення демонстраційні. Рядки позначені telegram_message_id < 0,
-- тому імпорт із Telegram (шукає лише додатні id) їх ніколи не зачепить.
-- Рядки створюються НЕОПУБЛІКОВАНИМИ (is_published = false).
-- Фото — статичні файли з репозиторію (/images/demo/*.webp), Storage не чіпаємо.
-- ============================================================================

-- ШАГ 0 (тільки читання): перевірте типи колонок і що демо ще немає.
--   select column_name, data_type, udt_name, is_nullable, column_default
--   from information_schema.columns
--   where table_schema = 'public' and table_name = 'products'
--   order by ordinal_position;
--
--   select count(*) from public.products where telegram_message_id < 0;  -- очікуємо 0

-- ШАГ 1: вставка. Блок атомарний: або всі 6 рядків, або жодного.
do $$
begin
  if exists (select 1 from public.products where telegram_message_id < 0) then
    raise exception 'Демо-товари вже існують. Спершу виконайте cleanup-demo-products.sql';
  end if;

  insert into public.products
    (title, description, price, currency, category, metal, sample, weight, item_type,
     images, telegram_message_id, telegram_post_url, status, is_published)
  values
    ('Золота каблучка',
     'Класична каблучка з жовтого золота.',
     14900, 'UAH', 'manufacturer', 'Золото', '585', 3.4, 'Каблучка',
     array['/images/demo/ring-gold.webp'], -1, null, 'available', false),

    ('Золотий ланцюжок, панцирне плетіння',
     'Золотий ланцюжок панцирного плетіння із застібкою-карабіном.',
     69800, 'UAH', 'manufacturer', 'Золото', '585', 18.6, 'Ланцюжок',
     array['/images/demo/chain-gold.webp'], -2, null, 'available', false),

    ('Золотий браслет',
     'Жорсткий браслет із жовтого золота.',
     38500, 'UAH', 'lombard', 'Золото', '585', 9.2, 'Браслет',
     array['/images/demo/bracelet-gold.webp'], -3, null, 'reserved', false),

    ('Срібні сережки-краплі',
     'Сережки-краплі зі срібла 925 проби на кільцях.',
     3200, 'UAH', 'manufacturer', 'Срібло', '925', 6.1, 'Сережки',
     array['/images/demo/earrings-silver.webp'], -4, null, 'available', false),

    ('Срібний ланцюжок',
     'Тонкий срібний ланцюжок якірного плетіння.',
     2400, 'UAH', 'lombard', 'Срібло', '925', 8.4, 'Ланцюжок',
     array['/images/demo/chain-silver.webp'], -5, null, 'available', false),

    ('Срібна каблучка',
     'Гладка каблучка зі срібла 925 проби.',
     1900, 'UAH', 'lombard', 'Срібло', '925', 5.2, 'Каблучка',
     array['/images/demo/ring-silver.webp'], -6, null, 'sold', false);
end $$;

-- ШАГ 2 (перевірка): має повернути 6 рядків.
--   select id, title, category, status, is_published, telegram_message_id
--   from public.products where telegram_message_id < 0 order by telegram_message_id desc;
