
export interface Note {
    id: string
    title: string
    content: string
    version: number
    updated_at: string
    collaborators?: number
    user_role?: string
}