
export function textTrunc(text: string, showLength: number): string {
    return text && text.length > 10 ? text.slice(0, showLength)+"..." : text ?? ""
}