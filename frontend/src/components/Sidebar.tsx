import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FileText, Plus, Search, Star, Clock, Trash2, Settings, LogOut, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const MOCK_NOTES = [
    { id: '1', title: 'Project Roadmap', updated: '2 min ago' },
    { id: '2', title: 'Meeting Notes – Sprint 12', updated: '1 hr ago' },
    { id: '3', title: 'API Design Document', updated: '3 hrs ago' },
]

const MOCK_SHARED_NOTES = [
    { id: '4', title: 'Bug Triage List', updated: 'Yesterday' },
    { id: '5', title: 'Onboarding Guide', updated: '2 days ago' },
]

const NAV_ITEMS = [
    { to: '/', icon: Clock, label: 'Recent' },
    { to: '#', icon: Star, label: 'Favorites' },
    { to: '/share-with-me', icon: Users, label: 'Shared with me' },
    { to: '#', icon: Trash2, label: 'Trash' },
]

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, signOut } = useAuth()

    return (
        <aside className="flex h-screen w-[280px] flex-col border-r border-border bg-sidebar shrink-0">
            {/* Brand */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                    <FileText size={18} />
                </div>
                <span className="text-base font-bold tracking-tight">CollabNotes</span>
            </div>

            {/* New Note */}
            <div className="px-4 pt-3 pb-2">
                <Button className="w-full gap-2" size="sm" onClick={() => navigate('/notes/new')}>
                    <Plus size={16} />
                    New Note
                </Button>
            </div>

            {/* Search */}
            <div className="relative px-4 pb-2">
                <Search size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search notes..."
                    className="pl-8 h-8 text-xs bg-muted/50"
                />
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-0.5 px-2 pb-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = item.to !== '#' && location.pathname === item.to
                    return (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-colors',
                                'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                isActive && 'bg-accent text-accent-foreground font-medium'
                            )}
                        >
                            <item.icon size={16} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <Separator />

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto px-2 pt-3">
                <span className="block px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    My Notes
                </span>
                <ul className="space-y-0.5">
                    {MOCK_NOTES.map((note) => {
                        const isActive = location.pathname === `/notes/${note.id}`
                        return (
                            <li key={note.id}>
                                <Link
                                    to={`/notes/${note.id}`}
                                    className={cn(
                                        'flex items-center gap-3 rounded-md px-3 py-1.5 transition-colors',
                                        'hover:bg-accent',
                                        isActive && 'bg-accent'
                                    )}
                                >
                                    <FileText size={14} className={cn('shrink-0 text-muted-foreground', isActive && 'text-primary')} />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium truncate">{note.title}</span>
                                        <span className="text-[11px] text-muted-foreground">{note.updated}</span>
                                    </div>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* Footer */}
            <Separator />
            <div className="p-2 space-y-1">
                <a
                    href="#"
                    className="flex items-center gap-3 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <Settings size={16} />
                    <span>Settings</span>
                </a>
                {user && (
                    <div className="flex items-center gap-3 rounded-md px-3 py-1.5">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-medium truncate">{user.name}</span>
                            <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={signOut} title="Sign out">
                            <LogOut size={14} />
                        </Button>
                    </div>
                )}
            </div>
        </aside>
    )
}
