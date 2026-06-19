"use server";

import { AssetStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole, requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function stringField(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

function optionalStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function statusField(formData: FormData) {
  const value = stringField(formData, "status");

  if (!Object.values(AssetStatus).includes(value as AssetStatus)) {
    throw new Error("Invalid asset status");
  }

  return value as AssetStatus;
}

export async function createAsset(formData: FormData) {
  await requireRole("ADMIN");

  const asset = await prisma.asset.create({
    data: {
      assetTag: stringField(formData, "assetTag"),
      name: stringField(formData, "name"),
      type: stringField(formData, "type"),
      serialNumber: stringField(formData, "serialNumber"),
      location: stringField(formData, "location"),
      status: statusField(formData),
      groupId: optionalStringField(formData, "groupId"),
      ownerId: optionalStringField(formData, "ownerId"),
    },
  });

  await prisma.assetHistory.create({
    data: {
      assetId: asset.id,
      changedById: asset.ownerId,
      newStatus: asset.status,
      note: "Asset created by administrator",
    },
  });

  revalidatePath("/assets");
  redirect("/assets");
}

export async function updateAsset(assetId: string, formData: FormData) {
  await requireRole("ADMIN");

  const existingAsset = await prisma.asset.findUniqueOrThrow({ where: { id: assetId } });
  const status = statusField(formData);

  const asset = await prisma.asset.update({
    where: { id: assetId },
    data: {
      assetTag: stringField(formData, "assetTag"),
      name: stringField(formData, "name"),
      type: stringField(formData, "type"),
      serialNumber: stringField(formData, "serialNumber"),
      location: stringField(formData, "location"),
      status,
      groupId: optionalStringField(formData, "groupId"),
      ownerId: optionalStringField(formData, "ownerId"),
    },
  });

  if (existingAsset.status !== asset.status || existingAsset.ownerId !== asset.ownerId) {
    await prisma.assetHistory.create({
      data: {
        assetId: asset.id,
        changedById: asset.ownerId,
        previousStatus: existingAsset.status,
        newStatus: asset.status,
        note: "Asset updated by administrator",
      },
    });
  }

  revalidatePath("/assets");
  redirect("/assets");
}

export async function acquireAsset(assetId: string) {
  const user = await requireUser();
  const asset = await prisma.asset.findUniqueOrThrow({ where: { id: assetId } });

  if (asset.status !== AssetStatus.AVAILABLE) {
    throw new Error("Only available assets can be acquired");
  }

  await prisma.asset.update({
    where: { id: assetId },
    data: {
      ownerId: user.id,
      status: AssetStatus.IN_USE,
      history: {
        create: {
          changedById: user.id,
          previousStatus: asset.status,
          newStatus: AssetStatus.IN_USE,
          note: "Asset acquired by user",
        },
      },
    },
  });

  revalidatePath("/assets");
  revalidatePath("/dashboard");
}

export async function releaseAsset(assetId: string) {
  const user = await requireUser();
  const asset = await prisma.asset.findUniqueOrThrow({ where: { id: assetId } });

  if (asset.ownerId !== user.id) {
    throw new Error("Only the current owner can release this asset");
  }

  await prisma.asset.update({
    where: { id: assetId },
    data: {
      ownerId: null,
      status: AssetStatus.AVAILABLE,
      history: {
        create: {
          changedById: user.id,
          previousStatus: asset.status,
          newStatus: AssetStatus.AVAILABLE,
          note: "Asset released by user",
        },
      },
    },
  });

  revalidatePath("/assets");
  revalidatePath("/dashboard");
}
