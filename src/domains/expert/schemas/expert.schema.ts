import { z } from 'zod'

export const ExpertSpecializations = [
  'Anksiyete ve Kaygı',
  'Depresyon',
  'İlişki Problemleri',
  'Travma ve TSSB',
  'Bağımlılık',
  'Aile Terapisi',
  'Çift Terapisi',
  'Çocuk ve Ergen',
  'Kişilik Bozuklukları',
  'Yeme Bozuklukları',
  'Uyku Sorunları',
  'Öfke Yönetimi',
  'Özgüven ve Benlik',
  'Kayıp ve Yas',
  'Kariyer ve İş Stresi',
] as const

export type ExpertSpecialization = (typeof ExpertSpecializations)[number]

export const ExpertOnboardingSchema = z.object({
  title:           z.string().min(2, 'Ünvan en az 2 karakter olmalı'),
  specializations: z.array(z.string()).min(1, 'En az bir uzmanlık alanı seçiniz'),
  experienceYears: z.number().min(0).max(50),
  bio:             z.string().min(50, 'Biyografi en az 50 karakter olmalı').max(1000),
  avatarUrl:       z.string().url().nullable().optional(),
})

export const ExpertSchema = z.object({
  id:              z.string().uuid(),
  name:            z.string(),
  title:           z.string(),
  specializations: z.array(z.string()),
  experienceYears: z.number(),
  bio:             z.string(),
  avatarUrl:       z.string().url().nullable(),
  rating:          z.number().min(0).max(5),
  reviewCount:     z.number().int().min(0),
  isVerified:      z.boolean(),
  status:          z.enum(['pending', 'approved', 'rejected']),
})

export type ExpertOnboarding = z.infer<typeof ExpertOnboardingSchema>
export type Expert = z.infer<typeof ExpertSchema>
