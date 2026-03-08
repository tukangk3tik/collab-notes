import type { PostNote, UpdateNote } from "@/types/post-note";
import type { PostCollaborator } from "@/types/collaborator";
import type { Note } from "@/types/note";
import { client } from "./apiService";

export const noteService = {
  getNotes: (userId: string) => client<Note[]>(`/notes?owner_id=${userId}`),
  getNoteById: (noteId: string, userId: string) => client<Note>(`/notes/${noteId}?user_id=${userId}`),
  createNote: (data: PostNote) => client<Note>('/notes', { body: data, method: 'POST' }),
  updateNote: (id: string, data: UpdateNote) => client<Note>(`/notes/${id}`, { body: data, method: 'PUT' }),
  addCollaborator: (noteId: string, data: PostCollaborator) =>
    client(`/notes/${noteId}/collaborators`, { body: data, method: 'POST' }),
  getSharedNotes: (userId: string) => client<Note[]>(`/shared-notes?collaborator_id=${userId}`),
};