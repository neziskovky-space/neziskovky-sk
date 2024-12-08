import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { cookies } from "next/headers";

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
	return createServerClient(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				async getAll() {
					return (await cookieStore).getAll();
				},
				async setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							(await cookieStore).set(name, value, options);
						}
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
};