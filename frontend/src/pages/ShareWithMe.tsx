import { Link } from 'react-router-dom'
import { FileText, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const RECENT_NOTES = [
    {
        id: '4',
        title: 'Bug Triage List',
        preview: 'Critical bugs from the latest QA pass...',
        updatedAt: 'Yesterday',
        collaborators: 4,
    },
    {
        id: '5',
        title: 'Onboarding Guide',
        preview: 'Steps for new engineers joining the team...',
        updatedAt: '2 days ago',
        collaborators: 1,
    },
    {
        id: '6',
        title: 'Product Requirements',
        preview: 'Feature spec for the collaborative editor MVP...',
        updatedAt: '3 days ago',
        collaborators: 6,
    },
]

const AVATAR_COLORS = ['bg-violet-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500']

export default function ShareWithMe() {
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
                {RECENT_NOTES.map((note) => (
                    <Link to={`/notes/${note.id}`} key={note.id} className="group">
                        <Card className="h-full hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                            <CardContent className="flex flex-col p-5 h-full">
                                {/* Card Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <FileText size={16} className="text-primary" />
                                    <Badge variant="secondary" className="text-[11px] font-normal">
                                        {note.updatedAt}
                                    </Badge>
                                </div>

                                {/* Title + Preview */}
                                <h3 className="text-sm font-semibold mb-1.5 group-hover:text-primary transition-colors">
                                    {note.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                                    {note.preview}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                                    <div className="flex -space-x-1.5">
                                        {Array.from({ length: Math.min(note.collaborators, 3) }).map((_, i) => (
                                            <Avatar key={i} className="h-5 w-5 border border-card">
                                                <AvatarFallback className={`${AVATAR_COLORS[i]} text-[8px] text-white`}>
                                                    {String.fromCharCode(65 + i)}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                    {note.collaborators > 3 && (
                                        <span className="text-[11px] text-muted-foreground">
                                            +{note.collaborators - 3} more
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
