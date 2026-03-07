import { useState } from 'react'
import { UserPlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { noteService } from '@/services/noteAPI'
import { toast } from 'sonner'

interface AddCollaboratorDialogProps {
    noteId: string
    trigger?: React.ReactNode
}

export default function AddCollaboratorDialog({ noteId, trigger }: AddCollaboratorDialogProps) {
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<'editor' | 'viewer'>('editor')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await noteService.addCollaborator(noteId, {
                email: email.trim(),
                role,
            })
            toast('Collaborator added', {
                description: `User added as ${role}`,
                position: 'top-right',
            })
            setOpen(false)
            setEmail('')
            setRole('editor')
        } catch (err: any) {
            toast('Failed to add collaborator', {
                description: err?.error || err || 'Something went wrong',
                position: 'top-right',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2 h-8">
                        <UserPlus size={14} />
                        Add Collaborator
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Collaborator</DialogTitle>
                    <DialogDescription>
                        Invite someone to collaborate on this note by entering their user ID and selecting a role.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* User ID */}
                    <div className="space-y-2">
                        <Label htmlFor="collab-user-id">User ID</Label>
                        <Input
                            id="collab-user-id"
                            placeholder="Enter user UUID"
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label htmlFor="collab-role">Role</Label>
                        <Select value={role} onValueChange={(v) => setRole(v as 'editor' | 'viewer')} disabled={isSubmitting}>
                            <SelectTrigger id="collab-role" className="w-full">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="editor">
                                    <div className="flex flex-col">
                                        <span className="font-medium">Editor</span>
                                        <span className="text-[11px] text-muted-foreground">Can view and edit the note</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="viewer">
                                    <div className="flex flex-col">
                                        <span className="font-medium">Viewer</span>
                                        <span className="text-[11px] text-muted-foreground">Can only view the note</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="gap-2" disabled={isSubmitting || !email.trim()}>
                            {isSubmitting ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <UserPlus size={14} />
                            )}
                            {isSubmitting ? 'Adding...' : 'Add'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
