// src/app/api/auth/[...nextauth]/route.ts

// Import handlers dari config NextAuth yang tadi kita buat
import { handlers } from "@/lib/auth";

// Export GET dan POST handler
// GET  → untuk cek session, callback login
// POST → untuk proses login, logout
export const { GET, POST } = handlers;