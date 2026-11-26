import { getEmbedded, getHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Category, CategoryEntity } from "@/types/category";

/** HAL service for the runtime-managed `/categories` catalog. */
export class CategoryService {
    constructor(private authProvider: AuthProvider) {
    }

    async getCategories(): Promise<Category[]> {
        const resource = await getHal("/categories", this.authProvider);
        return getEmbedded<CategoryEntity>(resource, "categories");
    }
}
