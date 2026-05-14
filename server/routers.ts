import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { hashPassword, verifyPassword, generateEmailOpenId } from "./_core/auth";
import { upsertUser, getUserByEmail } from "./db";
import { z } from "zod";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const existingUser = await getUserByEmail(input.email);
          if (existingUser) {
            throw new Error("User with this email already exists");
          }

          const hashedPassword = await hashPassword(input.password);
          const openId = generateEmailOpenId(input.email);

          await upsertUser({
            email: input.email,
            password: hashedPassword,
            name: input.name,
            openId,
            loginMethod: "email",
            lastSignedIn: new Date(),
          });

          return { success: true };
        } catch (error) {
          console.error("[Auth] Registration failed:", error);
          throw new Error(error instanceof Error ? error.message : "Registration failed");
        }
      }),
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const user = await getUserByEmail(input.email);
          if (!user || !user.password) {
            throw new Error("Invalid email or password");
          }

          const isValidPassword = await verifyPassword(input.password, user.password);
          if (!isValidPassword) {
            throw new Error("Invalid email or password");
          }

          await upsertUser({
            openId: user.openId,
            lastSignedIn: new Date(),
          });

          return { success: true, user: { id: user.id, name: user.name, email: user.email } };
        } catch (error) {
          console.error("[Auth] Login failed:", error);
          throw new Error(error instanceof Error ? error.message : "Login failed");
        }
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
