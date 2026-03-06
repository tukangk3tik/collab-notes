import { useLocation } from 'react-router-dom'
import { Share2, Users, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const MOCK_COLLABORATORS = [
    { id: '1', name: 'Alice', color: 'bg-violet-500' },
    { id: '2', name: 'Bob', color: 'bg-teal-500' },
    { id: '3', name: 'Carol', color: 'bg-orange-500' },
]

export default function Header() {
    const location = useLocation()
    const isEditor = location.pathname.startsWith('/notes/')

    return (
        <header className="flex h-14 items-center justify-between border-b border-border px-6 bg-background shrink-0">
            <div className="flex items-center gap-3">
                <h1 className="text-base font-semibold tracking-tight">
                    {isEditor ? 'Note Editor' : 'Dashboard'}
                </h1>
            </div>

            <div className="flex items-center gap-3">
                {isEditor && (
                    <>
                        {/* Collaborator Avatars */}
                        <div className="flex -space-x-2">
                            {MOCK_COLLABORATORS.map((user) => (
                                <Avatar key={user.id} className="h-7 w-7 border-2 border-background hover:-translate-y-0.5 transition-transform cursor-pointer">
                                    <AvatarFallback className={`${user.color} text-white text-[11px] font-semibold`}>
                                        {user.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                            <Avatar className="h-7 w-7 border-2 border-background">
                                <AvatarFallback className="bg-muted text-muted-foreground">
                                    <Users size={12} />
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <Separator orientation="vertical" className="h-5" />

                        <Button variant="outline" size="sm" className="gap-2 h-8">
                            <Share2 size={14} />
                            Share
                        </Button>
                    </>
                )}

                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal size={16} />
                </Button>
            </div>
        </header>
    )
}
