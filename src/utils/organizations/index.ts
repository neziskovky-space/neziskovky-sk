import { createClient } from "@/utils/supabase/client";
import type { NGO } from "../types";
async function getAllOrganizations() {
	const supabase = createClient();
	const PAGE_SIZE = 1000;
	let allOrganizations: NGO[] = [];
	let page = 0;
	let hasMore = true;

	while (hasMore) {
		const { data, error } = await supabase
			.from("organizations")
			.select()
			.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
			.order("OrganizationID", { ascending: true });

		if (error) {
			console.error("Error fetching organizations:", error);
			break;
		}

		if (data.length < PAGE_SIZE) {
			hasMore = false;
		}

		allOrganizations = [...allOrganizations, ...data];
		page++;
	}

	return allOrganizations;
}

export { getAllOrganizations };
