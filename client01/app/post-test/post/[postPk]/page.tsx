import { publicEnv } from "@/lib/env.public";
import { notFound } from "next/navigation";
import PostOwnerOptions from "@/components/PostOwnerOptions";

export default async function PostDetailPage({ params }: { params: Promise<{postPk: string}> }) { 
    
    const { postPk } = await params

    type Post = {
        postPk: number;
        postTitle: string;
        postContent: string;
        postCreatedAt: string;
        postUpdatedAt: string;
        writerPk: number;
        writerId: string;
    }

    let data: Post = {
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

        data = (await postResponse.json()) as Post
    } catch (error) {
        console.log(error)
    }


    return (
        <main className="flex-1 flex flex-col items-center justify-start p-6 gap-6">
            <PostOwnerOptions writerPk={data.writerPk} postPk={Number(postPk)} />
            <h1 className="text-xl font-bold">{data.postTitle}</h1>
            <div>{data.writerId}</div>
            <article>{data.postContent}</article>
        </main>
    )
}