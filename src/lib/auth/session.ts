import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase";

function metadataRole(value: unknown) {
  return typeof value === "string" && Object.values(Role).includes(value as Role) ? (value as Role) : null;
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser?.email) {
    return null;
  }

  const role = metadataRole(authUser.app_metadata.role) ?? metadataRole(authUser.user_metadata.role);
  const name =
    authUser.user_metadata.full_name ?? authUser.user_metadata.name ?? authUser.email.split("@")[0];

  return prisma.user.upsert({
    where: { supabaseUserId: authUser.id },
    update: {
      email: authUser.email,
      name,
      ...(role ? { role } : {}),
    },
    create: {
      supabaseUserId: authUser.id,
      email: authUser.email,
      name,
      role: role ?? Role.USER,
    },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(role: Role) {
  const user = await requireUser();

  if (user.role !== role) {
    redirect("/dashboard");
  }

  return user;
}
