import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. Create Permissions
  const permissions = [
    // Super Admin
    { action: "manage", subject: "all" },


    // Service Management
    { action: "create", subject: "service" },
    { action: "read", subject: "service" },
    { action: "update", subject: "service" },
    { action: "delete", subject: "service" },

    // News Management
    { action: "create", subject: "news" },
    { action: "read", subject: "news" },
    { action: "update", subject: "news" },
    { action: "delete", subject: "news" },

    // Job Article Management
    { action: "create", subject: "job" },
    { action: "read", subject: "job" },
    { action: "update", subject: "job" },
    { action: "delete", subject: "job" },

    // User Management
    { action: "create", subject: "user" },
    { action: "read", subject: "user" },
    { action: "update", subject: "user" },
    { action: "delete", subject: "user" },

    // Role Management
    { action: "create", subject: "role" },
    { action: "read", subject: "role" },
    { action: "update", subject: "role" },
    { action: "delete", subject: "role" },

    // System Config Management
    { action: "create", subject: "system-config" },
    { action: "read", subject: "system-config" },
    { action: "update", subject: "system-config" },
    { action: "delete", subject: "system-config" },

  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        action_subject: {
          action: permission.action,
          subject: permission.subject,
        },
      },
      update: {},
      create: permission,
    });
  }
  console.log(`Seeded ${permissions.length} permissions`);

  // 2. Create Roles and connect permissions
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      permissions: {
        connect: [{ action_subject: { action: "manage", subject: "all" } }],
      },
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: "editor" },
    update: {},
    create: {
      name: "editor",
      permissions: {
        connect: [
          // Article permissions
          { action_subject: { action: "create", subject: "Article" } },
          { action_subject: { action: "read", subject: "Article" } },
          { action_subject: { action: "update", subject: "Article" } },
          
          // Service permissions
          { action_subject: { action: "create", subject: "Service" } },
          { action_subject: { action: "read", subject: "Service" } },
          { action_subject: { action: "update", subject: "Service" } },
          
          // News permissions
          { action_subject: { action: "create", subject: "News" } },
          { action_subject: { action: "read", subject: "News" } },
          { action_subject: { action: "update", subject: "News" } },
          
          // Job Article permissions
          { action_subject: { action: "create", subject: "JobArticle" } },
          { action_subject: { action: "read", subject: "JobArticle" } },
          { action_subject: { action: "update", subject: "JobArticle" } },
        ],
      },
    },
  });
  console.log(`Seeded 2 roles`);

  // 3. Create Users
  const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
  const hashedPasswordEditor = await bcrypt.hash("editor123", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password_hash: hashedPasswordAdmin,
      role_id: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { username: "editor" },
    update: {},
    create: {
      username: "editor",
      password_hash: hashedPasswordEditor,
      role_id: editorRole.id,
    },
  });

  console.log(`Seeded 2 users`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
