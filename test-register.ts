import "dotenv/config";
import { registerAction } from "./src/actions/auth.actions";

async function run() {
  try {
    const res = await registerAction({
      name: "Tester",
      email: "tester2@gmail.com",
      password: "password123",
    });
    console.log("Result:", res);
  } catch (err) {
    console.error("Crash:", err);
  }
}

run();
