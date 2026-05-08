'use client'

import { redirect } from "next/navigation"

export default function GoToOne() {
    redirect("post-test/1")
    return (
        <></>
    )
}