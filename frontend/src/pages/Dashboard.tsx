import { Link, useNavigate } from 'react-router-dom'
import { FileText, Plus, Clock, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const RECENT_NOTES = [
    {
        id: '1',
        title: 'Project Roadmap',
        preview: 'Q1 milestones and deliverables for the team...',
        updatedAt: '2 min ago',
        collaborators: 3,
    },
    {
        id: '2',
        title: 'Meeting Notes – Sprint 12',
        preview: 'Action items discussed during the retro...',
        updatedAt: '1 hr ago',
        collaborators: 5,
    },
    {
        id: '3',
        title: 'API Design Document',
        preview: 'REST endpoints, authentication flow, and rate limiting...',
        updatedAt: '3 hrs ago',
        collaborators: 2,
    },
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

const STATS = [
    { label: 'Total Notes', value: '24', icon: FileText, color: 'text-chart-1 bg-chart-1/10' },
    { label: 'Collaborators', value: '12', icon: Users, color: 'text-chart-2 bg-chart-2/10' },
    { label: 'This Week', value: '8', icon: TrendingUp, color: 'text-chart-3 bg-chart-3/10' },
]

export default function Dashboard() {
    const navigate = useNavigate()

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {STATS.map((stat) => (
                    <Card key={stat.label} className="hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-lg shrink-0 ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                                <span className="text-sm text-muted-foreground">{stat.label}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={16} />
                    <h2 className="text-sm font-semibold text-foreground">Recent Notes</h2>
                </div>
                <Button size="sm" className="gap-2" onClick={() => navigate('/notes/new')}>
                    <Plus size={14} />
                    New Note
                </Button>
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
