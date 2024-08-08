import { Passage } from "@prisma/client";

export interface PassagesResponse {
    passages: Passage[];
}
