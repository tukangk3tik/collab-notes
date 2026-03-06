import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Bold, Italic, Underline, List, ListOrdered,
    Link2, Image, Code, AlignLeft, AlignCenter,
    AlignRight, Undo2, Redo2, Type,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const MOCK_NOTES: Record<string, { title: string; content: string; version: number; updatedAt: string }> = {
    '1': {
        title: 'Project Roadmap',
        content: 'This document outlines the Q1 milestones and deliverables for the team.\n\n## Goals\n- Launch MVP by end of February\n- Complete API integration testing\n- Finalize design system components\n- Set up CI/CD pipeline\n\n## Timeline\nWeek 1-2: Core backend development\nWeek 3-4: Frontend integration\nWeek 5-6: Testing & QA\nWeek 7-8: Beta launch & iteration',
        version: 3,
        updatedAt: '2 min ago',
    },
    '2': {
        title: 'Meeting Notes – Sprint 12',
        content: 'Sprint 12 Retrospective\n\n## What went well\n- Completed all planned stories\n- Zero critical bugs in production\n- Great collaboration between frontend and backend teams\n\n## Action items\n- [ ] Set up monitoring dashboards\n- [ ] Review and update API documentation\n- [ ] Plan Sprint 13 scope',
        version: 5,
        updatedAt: '1 hr ago',
    },
}

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

export default function NoteEditor() {
    const { id } = useParams<{ id: string }>()
    const note = MOCK_NOTES[id || '1'] || MOCK_NOTES['1']

    const [title, setTitle] = useState(note.title)
    const [content, setContent] = useState(note.content)

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
                        v{note.version}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        Edited {note.updatedAt}
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
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing..."
                />
            </div>

            {/* Statusbar */}
            <div className="flex items-center gap-3 pt-3 mt-4 border-t border-border text-[11px] text-muted-foreground shrink-0">
                <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                <span>{content.length} characters</span>
                <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Saved
                </span>
            </div>
        </div>
    )
}
