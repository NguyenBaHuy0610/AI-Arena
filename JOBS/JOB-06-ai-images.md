# JOB-06: AI Image Generation

## Goal
Generate 5 culturally accurate, realistic watercolor-style 2D illustrations for the MVP garments. Each image must clearly show the garment's structural features as described in the data files. Images are saved locally and optionally uploaded to Supabase Storage.

## Dependencies
- **JOB-03** (garment cards and detail pages can display images)

## Input (Read These Files First)
- `data/garments/ao-dai.json` — structural claims & summary
- `data/garments/ao-tu-than.json` — 4-panel structure, worn with yếm
- `data/garments/ao-ngu-than.json` — 5-panel, stand collar, 5 buttons
- `data/garments/ao-nhat-binh.json` — rectangular collar, A-line, court dress
- `data/garments/ao-ba-ba.json` — simple, button-front, pockets
- `data/avatar-specs.json` — rendering hints (hemY, collar type, sleeve radius)
- `data/colors.json` — traditional color hex values for accuracy
- `assets/credits.csv` — existing credits format

## Tasks

### Task 1: Generate Áo dài Illustration
**Prompt**:
```
A full-length illustration of a Vietnamese woman wearing an áo dài (Vietnamese traditional long dress). The áo dài has a high mandarin collar (cổ đứng), long fitted sleeves, a form-fitting bodice, and the tunic splits into two long panels (tà) at the waist, one in front and one in back, revealing flowing white silk trousers underneath. The dress is in deep indigo blue color (#274B6D, xanh chàm). The woman stands gracefully in a three-quarter pose. Realistic watercolor painting style with soft brush strokes, traditional Vietnamese art influence, warm golden ambient lighting, clean white background with subtle watercolor splashes. No text, no frame.
```
- **Aspect ratio**: 2:3
- **Save as**: `vietphuc-app/public/garments/ao-dai.webp`

### Task 2: Generate Áo tứ thân Illustration
**Prompt**:
```
A full-length illustration of a Vietnamese woman wearing an áo tứ thân (four-panel traditional Northern Vietnamese dress). The dress has four fabric panels - two in the back sewn together and two in the front left loose and untied, showing a colorful yếm (traditional bodice/camisole) underneath in pink (hồng đào). She wears a long dark skirt (váy đụp) underneath and a waist sash (thắt lưng). The áo tứ thân is in warm brown color (#6F4528, nâu gụ). Wide sleeves, loose flowing silhouette. She stands naturally. Realistic watercolor painting style with soft brush strokes, Northern Vietnamese folk art influence, warm natural lighting, clean white background with subtle watercolor splashes. No text, no frame.
```
- **Aspect ratio**: 2:3
- **Save as**: `vietphuc-app/public/garments/ao-tu-than.webp`

### Task 3: Generate Áo ngũ thân Illustration
**Prompt**:
```
A full-length illustration of a Vietnamese person wearing an áo ngũ thân (five-panel traditional Vietnamese robe). The robe is constructed from five pieces of fabric, has a standing collar (cổ đứng), with a visible row of five decorative buttons down the front. The garment has side slits and falls to below the knee. Deep crimson red color (#B3212B, đỏ son). Worn with matching dark trousers and a traditional khăn vấn (head wrap). The person stands in a dignified three-quarter pose. Realistic watercolor painting style, Nguyễn dynasty historical Vietnamese costume art, warm lighting, clean white background with subtle watercolor splashes. No text, no frame.
```
- **Aspect ratio**: 2:3
- **Save as**: `vietphuc-app/public/garments/ao-ngu-than.webp`

### Task 4: Generate Áo nhật bình Illustration
**Prompt**:
```
A full-length illustration of a Vietnamese court lady wearing an áo nhật bình (Nguyễn dynasty formal court dress). The defining feature is a large rectangular collar panel (nhật bình) that forms a rectangle across the chest when worn. The garment has an A-line bell-shaped silhouette, wide flowing sleeves, and intricate embroidered patterns. Rich golden yellow color (#D99A16, vàng nghệ) with ornate floral embroidery. Worn with dark trousers and a khăn vấn (traditional hair wrap). She stands with regal posture. Realistic watercolor painting style, Vietnamese royal court art influence, warm ambient lighting, clean white background with subtle watercolor splashes. No text, no frame.
```
- **Aspect ratio**: 2:3
- **Save as**: `vietphuc-app/public/garments/ao-nhat-binh.webp`

### Task 5: Generate Áo bà ba Illustration
**Prompt**:
```
A full-length illustration of a Vietnamese person wearing an áo bà ba (Southern Vietnamese traditional shirt). The áo bà ba is a simple, neat button-front shirt with a clean collar, buttons running from the neck to the belly, and front pockets. Long sleeves, relaxed comfortable fit. Dark black color (#1B1B1B, đen). Worn with simple silk trousers and a checkered khăn rằn (black and white checkered scarf) draped over the shoulder. Southern Vietnamese Mekong Delta pastoral setting suggested by subtle watercolor background hints of green. Realistic watercolor painting style, Vietnamese folk art, warm natural lighting, mostly white background. No text, no frame.
```
- **Aspect ratio**: 2:3
- **Save as**: `vietphuc-app/public/garments/ao-ba-ba.webp`

### Task 6: Update Credits File
Add entries to `assets/credits.csv` for each generated image:

```csv
file,title,author,source_url,license,attribution_text
ao-dai.webp,Minh họa tranh màu nước áo dài,AI Generated (Gemini),,ai-generated,Hình minh họa do AI tạo dựa trên mô tả cấu trúc từ Bảo tàng Lịch sử Quốc gia
ao-tu-than.webp,Minh họa tranh màu nước áo tứ thân,AI Generated (Gemini),,ai-generated,Hình minh họa do AI tạo dựa trên mô tả cấu trúc từ Bảo tàng Lịch sử Quốc gia
ao-ngu-than.webp,Minh họa tranh màu nước áo ngũ thân,AI Generated (Gemini),,ai-generated,Hình minh họa do AI tạo dựa trên mô tả từ VietnamPlus và Bảo tàng LSQG
ao-nhat-binh.webp,Minh họa tranh màu nước áo nhật bình,AI Generated (Gemini),,ai-generated,Hình minh họa do AI tạo dựa trên mô tả trang phục cung đình triều Nguyễn
ao-ba-ba.webp,Minh họa tranh màu nước áo bà ba,AI Generated (Gemini),,ai-generated,Hình minh họa do AI tạo dựa trên mô tả từ VJOL và Cổng TTVH
```

### Task 7: Update GarmentCard & GarmentDetail to Use Images
Modify the components to load images from `public/garments/{id}.webp`:

```javascript
// In GarmentCard.jsx and GarmentDetail.jsx
const imageUrl = `/garments/${garment.id}.webp`;

// Use with fallback
<img
  src={imageUrl}
  alt={garment.name.vi}
  onError={(e) => {
    e.target.style.display = 'none';
    // Show gradient placeholder instead
  }}
/>
```

## Output (Files Created/Modified)
- `vietphuc-app/public/garments/ao-dai.webp` [NEW — AI generated]
- `vietphuc-app/public/garments/ao-tu-than.webp` [NEW — AI generated]
- `vietphuc-app/public/garments/ao-ngu-than.webp` [NEW — AI generated]
- `vietphuc-app/public/garments/ao-nhat-binh.webp` [NEW — AI generated]
- `vietphuc-app/public/garments/ao-ba-ba.webp` [NEW — AI generated]
- `assets/credits.csv` [MODIFIED — new entries added]
- `src/components/GarmentCard.jsx` [MODIFIED — use real images]
- `src/components/GarmentDetail.jsx` [MODIFIED — use real images]

## Acceptance Criteria
1. All 5 images exist in `public/garments/`
2. Each image accurately represents the garment's key structural features:
   - Áo dài: mandarin collar, two panels split at waist, fitted silhouette
   - Áo tứ thân: four panels, loose front flaps, yếm visible, waist sash
   - Áo ngũ thân: five-panel construction, stand collar, front buttons, side slits
   - Áo nhật bình: rectangular collar panel, A-line shape, ornate embroidery
   - Áo bà ba: button-front, pockets, simple silhouette
3. All images have consistent watercolor art style
4. Images load correctly in GarmentCard and GarmentDetail components
5. Credits file updated with proper attribution
6. No copyright issues — all images are AI-generated with clear attribution
