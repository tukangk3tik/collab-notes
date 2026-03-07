import { Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Note } from '@/types/note'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'
import { noteService } from '@/services/noteAPI'
import NoteCard from '@/components/NoteCard'

export default function ShareWithMe() {
    const [sharedNotes, setSharedNotes] = useState<Note[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { getSharedNotes } = noteService
    const auth = useAuth()

    const loadSharedNotes = async () => {
        setIsLoading(true)
        try {
            const res = await getSharedNotes(auth.user!.id)
            setSharedNotes(res)
        } catch (err: any) {
            toast("Failed to load shared note", {
                description: err,
            })
        }
    }

    useEffect(() => {
        if (auth.user) {
            loadSharedNotes()
        }
    }, [auth.user])

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Users size={16} />
                    <h2 className="text-sm font-semibold text-foreground">Shared with me</h2>
                </div>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sharedNotes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                ))}
            </div>
        </div>
    )
}
