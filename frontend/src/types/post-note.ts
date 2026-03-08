export interface PostNote {
    title: string;
    content: string;
    owner_id: string;
}

export interface UpdateNote {
    title: string;
    content: string;
    user_id: string;
}