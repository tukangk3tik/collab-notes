export interface PostCollaborator {
    email: string;
    role: 'editor' | 'viewer';
}

export interface Collaborator {
    note_id: string;
    user_id: string;
    role: 'editor' | 'viewer';
    added_at: string;
}
