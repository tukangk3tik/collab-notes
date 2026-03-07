import { useNavigate } from 'react-router-dom'
import { FileText, Plus, Clock, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNotes } from '@/context/NotesContext'
import NoteCard from '@/components/NoteCard'

const STATS = [
    { label: 'Total Notes', value: '24', icon: FileText, color: 'text-chart-1 bg-chart-1/10' },
    { label: 'Collaborators', value: '12', icon: Users, color: 'text-chart-2 bg-chart-2/10' },
    { label: 'This Week', value: '8', icon: TrendingUp, color: 'text-chart-3 bg-chart-3/10' },
]

export default function Dashboard() {
    const navigate = useNavigate()
    const { notes } = useNotes()

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
                {notes.length > 0 ? notes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                )) : (
                    <div className="flex flex-col mt-4 ms-3">
                        <span className="text-[11px] text-sm text-muted-foreground">You don't have any note</span>
                    </div>
                )}
            </div>
        </div>
    )
}
