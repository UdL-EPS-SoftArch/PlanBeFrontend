import { getHal, mergeHal, mergeHalArray, postHal, patchHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { HalError } from "@/lib/errors";
import { User, UserValidationErrors, FieldError, UserFormData } from "@/types/user";
import halfred, { Resource } from "halfred";

export class UsersService {
    constructor(private authProvider: AuthProvider) {
    }

    async getUsers(): Promise<User[]> {
        const resource = await getHal('/users', this.authProvider);
        const embedded = resource.embeddedArray('users') || [];
        return mergeHalArray<User>(embedded);
    }

    async getUserById(id: string): Promise<User> {
        const resource = await getHal(`/users/${id}`, this.authProvider);
        return mergeHal<User>(resource);
    }

    async getCurrentUser(): Promise<User | null> {
        if (!await this.authProvider.getAuth()) {
            return null;
        }
        try {
            const resource = await getHal('/identity', this.authProvider);
            if (!resource) return null;
            return mergeHal<User>(resource);
        } catch (error) {
            // If 401 or similar, user is not authenticated
            return null;
        }
    }

    async createUser(user: UserFormData): Promise<{ user: User; errors?: UserValidationErrors }> {
        try {
            const resource = await postHal('/users', user, this.authProvider);
            const merged = mergeHal<User>(resource ?? halfred.parse({})) as User;

            // Extract validation errors from response body if any
            const errors: UserValidationErrors = {};
            if ('fieldErrors' in resource && resource.fieldErrors) {
                const fieldErrors: FieldError[] = (resource as any).fieldErrors || [];
                for (const fe of fieldErrors) {
                    if (fe.property === 'email') errors.email = fe.message;
                    if (fe.property === 'displayName') errors.displayName = fe.message;
                    if (fe.property === 'bio') errors.bio = fe.message;
                    if (fe.property === 'city') errors.city = fe.message;
                    if (fe.property === 'birthDate') errors.birthDate = fe.message;
                    if (fe.property === 'age') errors.age = fe.message;
                    if (fe.property === 'gender') errors.gender = fe.message;
                    if (fe.property === 'interests') errors.interests = fe.message as string;
                }
            }

            return { user: merged, errors };
        } catch (error: any) {
            if (error instanceof HalError) {
                const errors: UserValidationErrors = {};
                for (const fe of error.fieldErrors) {
                    if (fe.property === 'email') errors.email = fe.message;
                    if (fe.property === 'displayName') errors.displayName = fe.message;
                    if (fe.property === 'bio') errors.bio = fe.message;
                    if (fe.property === 'city') errors.city = fe.message;
                    if (fe.property === 'birthDate') errors.birthDate = fe.message;
                    if (fe.property === 'age') errors.age = fe.message;
                    if (fe.property === 'gender') errors.gender = fe.message;
                    if (fe.property === 'interests') errors.interests = fe.message as string;
                }
                return { user: halfred.parse({}) as User, errors };
            }
            throw error;
        }
    }

    async updateUser(id: string, user: UserFormData): Promise<{ user: User; errors?: UserValidationErrors }> {
        try {
            const resource = await patchHal(`/users/${id}`, user, this.authProvider);
            if (!resource) throw new Error("No response from server");
            const merged = mergeHal<User>(resource);

            // Extract validation errors from response body if any
            const errors: UserValidationErrors = {};
            if ('fieldErrors' in resource && resource.fieldErrors) {
                const fieldErrors: FieldError[] = (resource as any).fieldErrors || [];
                for (const fe of fieldErrors) {
                    if (fe.property === 'email') errors.email = fe.message;
                    if (fe.property === 'displayName') errors.displayName = fe.message;
                    if (fe.property === 'bio') errors.bio = fe.message;
                    if (fe.property === 'city') errors.city = fe.message;
                    if (fe.property === 'birthDate') errors.birthDate = fe.message;
                    if (fe.property === 'age') errors.age = fe.message;
                    if (fe.property === 'gender') errors.gender = fe.message;
                    if (fe.property === 'interests') errors.interests = fe.message as string;
                }
            }

            return { user: merged, errors };
        } catch (error: any) {
            if (error instanceof HalError) {
                const errors: UserValidationErrors = {};
                for (const fe of error.fieldErrors) {
                    if (fe.property === 'email') errors.email = fe.message;
                    if (fe.property === 'displayName') errors.displayName = fe.message;
                    if (fe.property === 'bio') errors.bio = fe.message;
                    if (fe.property === 'city') errors.city = fe.message;
                    if (fe.property === 'birthDate') errors.birthDate = fe.message;
                    if (fe.property === 'age') errors.age = fe.message;
                    if (fe.property === 'gender') errors.gender = fe.message;
                    if (fe.property === 'interests') errors.interests = fe.message as string;
                }
                return { user: halfred.parse({}) as User, errors };
            }
            throw error;
        }
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
        if (!await this.authProvider.getAuth()) {
            return { success: false, error: "No autenticado" };
        }
        try {
            await postHal('/users/password', { oldPassword, newPassword }, this.authProvider);
            return { success: true };
        } catch (error: any) {
            if (error instanceof HalError) {
                return { success: false, error: error.message || "Error en la contraseña" };
            }
            return { success: false, error: error.message || "Error desconocido" };
        }
    }
}