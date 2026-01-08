
export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
        return `${mins}min`;
    } else if (mins === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h ${mins.toString().padStart(2, '0')}`;
    }
}

export function normalizeTime(timeString: string): string {
    if (!timeString) return '20h00';
    
    let sanitized = timeString.trim().toLowerCase();
    
    if (/^\d{1,2}h\d{2}$/.test(sanitized)) return sanitized;
    if (/^\d{1,2}:\d{2}$/.test(sanitized)) return sanitized.replace(':', 'h');
    if (/^\d{1,2}h$/.test(sanitized)) return sanitized + '00';
    if (/^\d{4}$/.test(sanitized)) return sanitized.substring(0, 2) + 'h' + sanitized.substring(2);
    if (/^\d{1,2}$/.test(sanitized)) return sanitized.padStart(2, '0') + 'h00';
    
    return '20h00';
}

export function validateTime(timeString: string): boolean {
    const normalized = normalizeTime(timeString);
    const match = normalized.match(/^(\d{1,2})h(\d{2})$/);
    
    if (!match) return false;
    
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
}
