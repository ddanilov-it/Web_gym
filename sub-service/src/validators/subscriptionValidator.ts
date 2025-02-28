import { z } from "zod";

export const subscriptionSchema = z.object({
  clientId: z.number().int().positive("clientId must be a positive integer"),
  status: z.string(),
  startDate: z.string().refine(value => !isNaN(Date.parse(value)) && value.match(/^\d{4}-\d{2}-\d{2}$/), {
    message: "startDate must be a valid date (YYYY-MM-DD)"
  }),
  endDate: z.string().refine(value => !isNaN(Date.parse(value)) && value.match(/^\d{4}-\d{2}-\d{2}$/), {
    message: "startDate must be a valid date (YYYY-MM-DD)"
  }),
  //startDate: z.string().date({ message: "startDate must be a valid date-time string" }),
  //endDate: z.string().dat({ message: "endDate must be a valid date-time string" }),
});
