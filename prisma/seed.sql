-- ============================================================================
-- Datos iniciales de canchas
-- ============================================================================

INSERT INTO "Court"
(
  "name",
  "sport",
  "description",
  "pricePerHour",
  "active",
  "updatedAt"
)
VALUES
(
  'Cancha Fútbol 5 - A',
  'FÚTBOL 5',
  'Cancha de césped sintético para fútbol 5.',
  80.00,
  true,
  NOW()
),
(
  'Cancha Fútbol 5 - B',
  'FÚTBOL 5',
  'Cancha de césped sintético para fútbol 5.',
  80.00,
  true,
  NOW()
),
(
  'Cancha Fútbol 7',
  'FÚTBOL 7',
  'Cancha amplia de césped sintético para fútbol 7.',
  120.00,
  true,
  NOW()
),
(
  'Cancha Vóley',
  'VÓLEY',
  'Cancha acondicionada para partidos de vóley.',
  60.00,
  true,
  NOW()
)

ON CONFLICT ("name")
DO UPDATE SET
  "sport" = EXCLUDED."sport",
  "description" = EXCLUDED."description",
  "pricePerHour" = EXCLUDED."pricePerHour",
  "active" = EXCLUDED."active",
  "updatedAt" = NOW();