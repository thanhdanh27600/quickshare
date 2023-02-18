import {PrismaClient} from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	if (!(global as any).prisma) {
		(global as any).prisma = new PrismaClient();
	}
	prisma = (global as any).prisma;
}

prisma.$on("beforeExit", async () => {
	console.log("\x1b[33m prisma exiting...\n");
});

export default prisma;
