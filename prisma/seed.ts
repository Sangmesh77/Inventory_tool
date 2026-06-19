import { AssetStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [operations, engineering] = await Promise.all([
    prisma.assetGroup.upsert({
      where: { name: "Operations" },
      update: {},
      create: {
        name: "Operations",
        description: "Shared operations equipment and field assets",
      },
    }),
    prisma.assetGroup.upsert({
      where: { name: "Engineering" },
      update: {},
      create: {
        name: "Engineering",
        description: "Engineering workstations and lab devices",
      },
    }),
  ]);

  const [ada, grace] = await Promise.all([
    prisma.user.upsert({
      where: { email: "ada.lovelace@inventorylab.local" },
      update: {},
      create: {
        email: "ada.lovelace@inventorylab.local",
        name: "Ada Lovelace",
      },
    }),
    prisma.user.upsert({
      where: { email: "grace.hopper@inventorylab.local" },
      update: {},
      create: {
        email: "grace.hopper@inventorylab.local",
        name: "Grace Hopper",
      },
    }),
  ]);

  const assets = await Promise.all([
    prisma.asset.upsert({
      where: { assetTag: "INV-LAP-0001" },
      update: {},
      create: {
        assetTag: "INV-LAP-0001",
        name: "MacBook Pro 14",
        type: "Laptop",
        serialNumber: "MBP14-INV-0001",
        location: "HQ - Lab A",
        status: AssetStatus.IN_USE,
        ownerId: ada.id,
        groupId: engineering.id,
      },
    }),
    prisma.asset.upsert({
      where: { assetTag: "INV-TAB-0002" },
      update: {},
      create: {
        assetTag: "INV-TAB-0002",
        name: "iPad Air",
        type: "Tablet",
        serialNumber: "IPAIR-INV-0002",
        location: "HQ - Equipment Cage",
        status: AssetStatus.AVAILABLE,
        groupId: operations.id,
      },
    }),
    prisma.asset.upsert({
      where: { assetTag: "INV-SCN-0003" },
      update: {},
      create: {
        assetTag: "INV-SCN-0003",
        name: "Zebra Barcode Scanner",
        type: "Scanner",
        serialNumber: "ZBRA-INV-0003",
        location: "Warehouse 2",
        status: AssetStatus.IN_USE,
        ownerId: grace.id,
        groupId: operations.id,
      },
    }),
  ]);

  for (const asset of assets) {
    await prisma.assetHistory.upsert({
      where: { id: asset.id },
      update: {},
      create: {
        id: asset.id,
        assetId: asset.id,
        changedById: asset.ownerId,
        previousStatus: null,
        newStatus: asset.status,
        note: "Initial seed import",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
