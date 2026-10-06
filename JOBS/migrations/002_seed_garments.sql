-- ============================================
-- Việt Phục AI Arena — Seed 5 MVP Garments
-- ============================================

INSERT INTO garments (id, name_vi, category, regions, period_label, wearer, summary, claims, context_fit, parts, affinities, status)
VALUES
  ('ao-dai', 'Áo dài', 'cach-tan', ARRAY['viet-phuc','hue-trung-bo','nam-bo'],
   'Quá trình định hình từ thế kỷ XVIII; biến đổi mạnh trong thế kỷ XX đến nay',
   'chung',
   'Áo dài là trang phục biểu tượng của Việt Nam, thường có thân dài, cổ áo và tà xẻ hai bên.',
   '[{"key":"origin","text":"Nguồn gốc chính xác của áo dài chưa được xác định hoàn toàn.","sourceIds":["src-hcmussh-ao-dai"],"status":"checked","contested":true}]'::jsonb,
   '{"tet":2,"tot-nghiep":2,"ky-yeu":2,"pho-co":1,"hoi-lang":1}'::jsonb,
   ARRAY['ao','quan'],
   '{"accessories":{"non-la":1,"quai-thao":0},"shoes":{"guoc-moc":1,"sneaker":1}}'::jsonb,
   'checked'),

  ('ao-tu-than', 'Áo tứ thân', 'viet-phuc-phuc-dung', ARRAY['bac-bo'],
   'Thế kỷ XVII–XX', 'nu',
   'Áo tứ thân là hình ảnh gắn với trang phục phụ nữ Bắc Bộ.',
   '[]'::jsonb, '{"tet":2,"ky-yeu":2,"hoi-lang":2}'::jsonb,
   ARRAY['ao','yem','vay','that-lung'], '{}'::jsonb, 'draft'),

  ('ao-ngu-than', 'Áo ngũ thân', 'truyen-thong', ARRAY['viet-phuc'],
   'Thế kỷ XVIII–XX', 'chung',
   'Áo ngũ thân là dạng áo dài truyền thống có cấu trúc năm thân.',
   '[]'::jsonb, '{"tet":2,"ky-yeu":2,"hoi-lang":2}'::jsonb,
   ARRAY['ao','quan'], '{}'::jsonb, 'draft'),

  ('ao-nhat-binh', 'Áo Nhật Bình', 'viet-phuc-phuc-dung', ARRAY['hue-trung-bo','viet-phuc'],
   'Triều Nguyễn', 'nu',
   'Áo Nhật Bình là trang phục cung đình triều Nguyễn.',
   '[]'::jsonb, '{"tet":2,"ky-yeu":2}'::jsonb,
   ARRAY['ao','quan'], '{}'::jsonb, 'draft'),

  ('ao-ba-ba', 'Áo bà ba', 'truyen-thong', ARRAY['nam-bo'],
   'Thế kỷ XX đến nay', 'chung',
   'Áo bà ba là trang phục gắn với đời sống Nam Bộ.',
   '[]'::jsonb, '{"tet":1,"ky-yeu":1,"hoi-lang":1}'::jsonb,
   ARRAY['ao','quan'], '{}'::jsonb, 'draft')

ON CONFLICT (id) DO NOTHING;
