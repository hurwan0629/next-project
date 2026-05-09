import { publicEnv } from "@/lib/env.public"
import { notFound } from "next/navigation"
import PostUpdateForm from "./PostUpdateForm"
import { Post } from "@/lib/types/post";

export default async function PostUpdatePage({ params }: { params: Promise<{postPk: number}> }) {
    const { postPk } = await params

    

    let post: Post = {
        postPk: 0,
        postTitle: "",
        postContent: "",
        postCreatedAt: "",
        postUpdatedAt: "",
        writerPk: 0,
        writerId: ""
    }
    try {
        console.log("postRequest")
        const postResponse = await fetch(`${publicEnv.API_URL}/post/${postPk}`)

        if(!postResponse.ok) {
            notFound()
        }

        post = (await postResponse.json()) as Post
    } catch (error) {
        console.log(error)
    }

    return (
        <main className="flex-1 w-full flex flex-col items-center" >
            <PostUpdateForm post={post}/>
        </main>
    )
}