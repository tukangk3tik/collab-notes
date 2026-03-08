import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Bold, Italic, Underline, List, ListOrdered,
    Link2, Image, Code, AlignLeft, AlignCenter,
    AlignRight, Undo2, Redo2, Type,
    Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/context/AuthContext'
import { noteService } from '@/services/noteAPI'
import { toast } from 'sonner'
import type { Note } from '@/types/note'
import { timeAgo } from '@/lib/timeAgo'
import type { UpdateNote } from '@/types/post-note'
import { useNotes } from '@/context/NotesContext'
import { useDebounce } from '@/hooks/useDebounce'

const TOOLBAR_GROUPS = [
    [
        { icon: Bold, label: 'Bold' },
        { icon: Italic, label: 'Italic' },
        { icon: Underline, label: 'Underline' },
        { icon: Code, label: 'Code' },
    ],
    [
        { icon: Type, label: 'Heading' },
        { icon: List, label: 'Bullet List' },
        { icon: ListOrdered, label: 'Numbered List' },
    ],
    [
        { icon: AlignLeft, label: 'Align Left' },
        { icon: AlignCenter, label: 'Align Center' },
        { icon: AlignRight, label: 'Align Right' },
    ],
    [
        { icon: Link2, label: 'Link' },
        { icon: Image, label: 'Image' },
    ],
]

const WS_URL = import.meta.env.VITE_WS_KEY;

export default function NoteEditor() {
    const { id } = useParams<{ id: string }>()

    const auth = useAuth()
    const { updateNote } = useNotes()

    const [note, setNote] = useState<Note>()
    const [title, setTitle] = useState(note?.title ?? "")
    const [content, setContent] = useState(note?.content ?? "")

    const [isLoading, setIsLoading] = useState(false)
    const { getNoteById } = noteService

    const socketRef = useRef<WebSocket | null>(null)

    const loadNote = async () => {
        setIsLoading(true)
        try {
            const res = await getNoteById(id!, auth.user!.id)
            setNote(res)
            setTitle(res.title)
            setContent(res.content)
        } catch (err: any) {
            toast("Failed to load shared note", {
                description: err,
            })
        }
    }

    const handleUpdateNote = async () => {
        setIsLoading(true)
        try {
            const payload: UpdateNote = {
                title,
                content,
                user_id: auth.user!.id,
            }
            await updateNote(id!, payload)

            toast("Note has been updated", {
                description: `${title} has been updated`,
                position: "top-right",
            })
        } catch (err: any) {
            toast("Failed to update note", {
                description: err,
            })
        }
    }

    const sendEdit = useDebounce((value) => {
        if (!socketRef.current) return

        socketRef.current.send(
            JSON.stringify({
                type: "edit",
                note_id: id,
                content: value,
                user_id: auth.user!.id,
            })
        )
    }, 300);

    const handleChange = async (e: { target: { value: any } }) => {
        const value = e.target.value

        try {
            setContent(value)
            sendEdit(value)
        } catch (err: any) {
            toast("Failed to create note", {
                description: err,
            })
        }
    }

    useEffect(() => {
        if (auth.user) {
            loadNote()
        }

        const socket = new WebSocket(`${WS_URL}`)
        socketRef.current = socket

        socket.onopen = () => {
            socket.send(
                JSON.stringify({
                    type: "join",
                    note_id: id,
                    user_id: auth.user!.id,
                })
            )
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            console.log(data);
            console.log(`id check: `, data.note_id === id)
            if (data.type === 'edit' && data.note_id === id) {
                setContent(data.content)
                console.log("update from other user")
            }
        }

        return () => {
            socket.close()
        }

    }, [auth.user, id])

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto">
            {/* Toolbar */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-1.5 mb-4 shrink-0">
                <div className="flex items-center gap-0.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Undo2 size={15} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Redo2 size={15} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="mx-1 h-5" />

                    {TOOLBAR_GROUPS.map((group, gi) => (
                        <div key={gi} className="flex items-center gap-0.5">
                            {group.map((item) => (
                                <Tooltip key={item.label}>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <item.icon size={15} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{item.label}</TooltipContent>
                                </Tooltip>
                            ))}
                            {gi < TOOLBAR_GROUPS.length - 1 && (
                                <Separator orientation="vertical" className="mx-1 h-5" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[11px] font-normal">
                        v{note?.version}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        Edited {note?.updated_at && timeAgo(note.updated_at)}
                    </span>
                </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 flex flex-col min-h-0">
                <input
                    type="text"
                    className="text-3xl font-bold tracking-tight border-none bg-transparent outline-none mb-4 placeholder:text-muted-foreground"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Untitled Note"
                />
                <Textarea
                    className="flex-1 resize-none border-none bg-transparent text-sm leading-relaxed focus-visible:ring-0 min-h-[300px] p-0 placeholder:text-muted-foreground"
                    value={content}
                    onChange={handleChange}
                    placeholder="Start writing..."
                />
            </div>

            <div className="flex items-center justify-between pt-3 mt-4 border-t border-border">
                <Button size="sm" className="gap-2" onClick={handleUpdateNote}>
                    <Save size={14} />
                    Save Note
                </Button>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground shrink-0">
                    <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                    <span>{content.length} characters</span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Saved
                    </span>
                </div>
            </div>


            {/* Statusbar */}
            {/* <div className="flex items-center gap-3 pt-3 mt-4 border-t border-border text-[11px] text-muted-foreground shrink-0">
                <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                <span>{content.length} characters</span>
                <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Saved
                </span>
            </div> */}
        </div>
    )
}
