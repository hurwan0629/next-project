import Link from "next/link";

export default function LinkButton({ href, text }: { href: string; text: string }) {
    return (
        <Link href={href} className="p-4 bg-green-400 rounded-lg text-center h-12 flex items-center justify-center">
            {text}
        </Link>
    )
}