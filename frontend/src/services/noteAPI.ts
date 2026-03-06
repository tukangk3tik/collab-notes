import type { PostNote } from "@/types/post-note";
import { client } from "./apiService";

export const noteService = {
  createNote: (data: PostNote) => client('/notes', { body: data, method: 'POST' }),
};