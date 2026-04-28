import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomUUID } from "crypto";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken } from "../lib/jwt.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

const RegisterBody = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_.]+$/, "Username can only contain lowercase letters, numbers, . and _"),
  displayName: z.string().min(1).max(50),
  password: z.string().min(6),
});

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/auth/register", async (req, res): Promise<void> => {
  try {
    const body = RegisterBody.parse(req.body);

    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, body.email));
    if (existing.length > 0) {
      res.status(409).json({ error: "email_taken", message: "Email già in uso" });
      return;
    }

    const existingUsername = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, body.username.toLowerCase()));
    if (existingUsername.length > 0) {
      res.status(409).json({ error: "username_taken", message: "Username già in uso" });
      return;
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const id = randomUUID();
    const [user] = await db
      .insert(usersTable)
      .values({
        id,
        email: body.email.toLowerCase(),
        username: body.username.toLowerCase(),
        displayName: body.displayName,
        passwordHash,
      })
      .returning();

    const token = signToken({ userId: user!.id, email: user!.email, username: user!.username });
    res.status(201).json({
      token,
      user: {
        id: user!.id,
        email: user!.email,
        username: user!.username,
        displayName: user!.displayName,
        bio: user!.bio,
        link: user!.link,
        avatarUrl: user!.avatarUrl,
        isPublic: user!.isPublic,
        highlights: user!.highlights,
        createdAt: user!.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "validation", issues: err.issues });
      return;
    }
    req.log.error(err, "register error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/auth/login", async (req, res): Promise<void> => {
  try {
    const body = LoginBody.parse(req.body);
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, body.email.toLowerCase()));

    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      res.status(401).json({ error: "invalid_credentials", message: "Email o password non corretti" });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email, username: user.username });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        link: user.link,
        avatarUrl: user.avatarUrl,
        isPublic: user.isPublic,
        highlights: user.highlights,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "validation", issues: err.issues });
      return;
    }
    req.log.error(err, "login error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.userId));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      link: user.link,
      avatarUrl: user.avatarUrl,
      isPublic: user.isPublic,
      highlights: user.highlights,
      createdAt: user.createdAt,
    });
  } catch (err) {
    req.log.error(err, "me error");
    res.status(500).json({ error: "Server error" });
  }
});

const UpdateProfileBody = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(150).optional(),
  link: z.string().max(200).optional(),
  avatarUrl: z.string().optional(),
  isPublic: z.boolean().optional(),
  highlights: z.array(z.string()).max(10).optional(),
});

router.patch("/auth/profile", requireAuth, async (req, res): Promise<void> => {
  try {
    const body = UpdateProfileBody.parse(req.body);
    const [updated] = await db
      .update(usersTable)
      .set({
        ...(body.displayName !== undefined && { displayName: body.displayName }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.link !== undefined && { link: body.link }),
        ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
        ...(body.isPublic !== undefined && { isPublic: body.isPublic }),
        ...(body.highlights !== undefined && { highlights: body.highlights }),
      })
      .where(eq(usersTable.id, req.user!.userId))
      .returning();
    res.json({
      id: updated!.id,
      email: updated!.email,
      username: updated!.username,
      displayName: updated!.displayName,
      bio: updated!.bio,
      link: updated!.link,
      avatarUrl: updated!.avatarUrl,
      isPublic: updated!.isPublic,
      highlights: updated!.highlights,
      createdAt: updated!.createdAt,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "validation", issues: err.issues });
      return;
    }
    req.log.error(err, "update profile error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/users/check-username", async (req, res): Promise<void> => {
  try {
    const username = String(req.query.username ?? "").toLowerCase();
    if (!username || username.length < 3) {
      res.json({ available: false });
      return;
    }
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, username));
    res.json({ available: existing.length === 0 });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/users/:username", async (req, res): Promise<void> => {
  try {
    const username = req.params.username?.toLowerCase() ?? "";
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      link: user.link,
      avatarUrl: user.avatarUrl,
      isPublic: user.isPublic,
      highlights: user.highlights,
      createdAt: user.createdAt,
    });
  } catch (err) {
    req.log.error(err, "get user error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
