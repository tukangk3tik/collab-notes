import { client } from "@/services/apiService"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./AuthContext"
import { noteService } from '@/services/noteAPI'
import type { PostNote, UpdateNote } from "@/types/post-note"
import type { Note } from "@/types/note"

interface NotesContextType {
    notes: Note[]
    loading: boolean
    error: string | null
    createNote: (postNote: PostNote) => Promise<void>
    updateNote: (id: string, payload: UpdateNote) => Promise<void>
    updateNoteAsCollaborator: (id: string, content: string) => void
    deleteNote: (id: string) => void
}

export const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
    const [notes, setNotes] = useState<Note[]>()
    const [isLoading, setIsLoading] = useState(true)
    const auth = useAuth()

    const fetchNotes = async () => {
        try {
            const res = await noteService.getNotes(auth.user!.id)
            setNotes(res)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (auth.user) {
            setTimeout(() => {
                fetchNotes()
            }, 500);
        }
    }, [auth.user])

    const createNote = async (postNote: PostNote) => {
        try {
            const res = await client(`/notes`, {
                method: 'POST',
                body: postNote,
            })
            setTimeout(() => {
                setNotes([res, ...notes || []])
            }, 1000);
        } catch (error) {
            console.error(error)
        }
    }

    const updateNote = async (id: string, payload: UpdateNote) => {
        try {
            const res = await client(`/notes/${id}`, {
                method: 'PUT',
                body: payload,
            })
            setNotes(notes?.map((note) => note.id === id ? res : note))
        } catch (error) {
            console.error(error)
        }
    }

    const updateNoteAsCollaborator = async (id: string, content: string) => {
        try {
            const res = await client(`/notes/${id}`, {
                method: 'PUT',
                body: { content },
            })
            setNotes(notes?.map((note) => note.id === id ? res : note))
        } catch (error) {
            console.error(error)
        }
    }

    const deleteNote = async (id: string) => {
        try {
            await client(`/notes/${id}`, {
                method: 'DELETE',
            })
            setNotes(notes?.filter((note) => note.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <NotesContext.Provider value={{ notes: notes || [], loading: isLoading, error: null, createNote, updateNote, updateNoteAsCollaborator, deleteNote }}>
            {children}
        </NotesContext.Provider>
    )
}

export function useNotes() {
    const context = useContext(NotesContext)
    if (!context) {
        throw new Error('useNotes must be used within an NotesProvider')
    }
    return context
}