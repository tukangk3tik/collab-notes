import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'
import { useNotes } from '@/context/NotesContext'

export default function NewNote() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const auth = useAuth()
    const { createNote } = useNotes()

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            await createNote({
                title,
                content,
                owner_id: auth.user!.id,
            })
            toast("New note has been created", {
                description: `${title} has been created`,
                position: "top-right",
            })

            setTimeout(() => {
                setIsSaving(false)
                navigate('/')
            }, 1000)
        } catch (err: any) {
            toast("Failed to create note", {
                description: err,
            })
            setIsSaving(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Back button */}
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/')}>
                <ArrowLeft size={16} />
                Back to Dashboard
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileText size={20} />
                        </div>
                        <div>
                            <CardTitle>Create New Note</CardTitle>
                            <CardDescription>Fill in the details below to create a new note</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Title */}
                        <div className="space-y-2">
                            <label htmlFor="note-title" className="text-sm font-medium">
                                Title
                            </label>
                            <Input
                                id="note-title"
                                placeholder="e.g. Project Roadmap"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                autoFocus
                                disabled={isSaving}
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <label htmlFor="note-content" className="text-sm font-medium">
                                Content
                            </label>
                            <Textarea
                                id="note-content"
                                placeholder="Start writing your note..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                disabled={isSaving}
                                className="min-h-[250px] resize-none leading-relaxed"
                            />
                            <div className="flex justify-end gap-3 text-xs text-muted-foreground">
                                <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                                <span>{content.length} characters</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/')}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="gap-2"
                                disabled={isSaving || !title.trim() || !content.trim()}
                            >
                                {isSaving ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                {isSaving ? 'Saving...' : 'Create Note'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
