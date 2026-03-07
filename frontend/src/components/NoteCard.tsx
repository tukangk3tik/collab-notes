import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { timeAgo } from '@/lib/timeAgo'
import type { Note } from '@/types/note'

const AVATAR_COLORS = ['bg-violet-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500']

interface NoteCardProps {
    note: Note
}

export default function NoteCard({ note }: NoteCardProps) {
    return (
        <Link to={`/notes/${note.id}`} className="group">
            <Card className="h-full hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <CardContent className="flex flex-col p-5 h-full">
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-3">
                        <FileText size={16} className="text-primary" />
                        <Badge variant="secondary" className="text-[11px] font-normal">
                            {timeAgo(note.updated_at)}
                        </Badge>
                    </div>

                    {/* Title + Preview */}
                    <h3 className="text-sm font-semibold mb-1.5 group-hover:text-primary transition-colors">
                        {note.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                        {note.content}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                        <div className="flex -space-x-1.5">
                            {note.collaborators && Array.from({ length: Math.min(note.collaborators, 3) }).map((_, i) => (
                                <Avatar key={i} className="h-5 w-5 border border-card">
                                    <AvatarFallback className={`${AVATAR_COLORS[i]} text-[8px] text-white`}>
                                        {String.fromCharCode(65 + i)}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        {note.collaborators && note.collaborators > 3 && (
                            <span className="text-[11px] text-muted-foreground">
                                +{note.collaborators - 3} more
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
