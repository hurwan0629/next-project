export function formatDefaultDateTime(value: string) {
    return value.replace("T", " ").slice(0,16)
}