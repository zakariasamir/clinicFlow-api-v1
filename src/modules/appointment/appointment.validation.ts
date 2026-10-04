import { z } from "zod";
import { AppointmentStatus } from "@prisma/client";

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid("Identifiant du patient invalide"),
  appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La date et l'heure du rendez-vous doivent être valides",
  }),
  status: z.nativeEnum(AppointmentStatus).optional().default(AppointmentStatus.PENDING),
  reason: z.string().min(2, "Le motif du rendez-vous est obligatoire"),
  notes: z.string().optional().nullable(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.nativeEnum(AppointmentStatus),
});

export const queryAppointmentSchema = z.object({
  date: z.string().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
export type QueryAppointmentInput = z.infer<typeof queryAppointmentSchema>;
