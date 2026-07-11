// services/studio.ts
import { fetchApi } from "./api";

export class InstructorService {
    static async applyForInstructor(data: any) {
        return await fetchApi("/api/public/users/apply-instructeur/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
}

