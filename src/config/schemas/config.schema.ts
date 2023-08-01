import z from "zod";

const configValidateSchema = z.object({
  port: z.number().int().min(0).max(60000),
  logger: z.object({
    level: z.string(),
    filePath: z.string(),
  }),
  redis: z.object({
    host: z.string(),
    port: z.number().int(),
  }),
  openExchange: z.object({
    appId: z.string(),
  }),
});

export default configValidateSchema;
