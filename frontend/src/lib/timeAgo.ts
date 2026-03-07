
export function timeAgo(dateString: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return new Date(dateString).toLocaleDateString()
}
