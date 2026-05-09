import LinkButton from "@/components/LinkButton";
import { publicEnv } from "@/lib/env.public"
import Link from "next/link";

export default async function PostPage({ params, }: {params: Promise<{ page: string }>}) {
    
    const { page } = await params;
    const maxPostCount = 8;

    let maxPageCount: any = 0;
    
    // 페이지당 게시글 개수 받아오기
    try {
        const pageCountResponse = await fetch(`${publicEnv.API_URL}/post/max-page?maxPostCount=${maxPostCount}`)
        if(pageCountResponse.ok) {
            maxPageCount = (await pageCountResponse.json()).maxPageCount
        }
    } catch (e) {
        console.log(e)
    }

    // 게시글 목록 가져오기
    type Post = {
        postPk: number;
        postTitle: string;
        postCreatedAt: string;
        writerId: string;
        postViewCount: number;
    }
    let postList: Post[] = []
    try {
        const postListResponse = await fetch(
            `${publicEnv.API_URL}/post/all?page=${page}&maxPostCount=${maxPostCount}`)
        if(!postListResponse.ok) {
            throw new Error("fetch Failed")
        }
        console.log(postListResponse)
        postList = await postListResponse.json();
    } catch (error) {
        console.log(error)
    }

    
    return (
        <main className="flex-1 w-full flex flex-col items-center justify-start p-8 gap-4" >
            <h3 className="text-xl font-bold">게시판</h3> 
            
            <div className="flex-1 flex flex-col items-center justify-start w-[70%] h-full rounded-md gap-2 p-2">
                <div className="w-full flex flex-col items-end justify-start">
                    <LinkButton href="/post-test/post/write" text="게시글 쓰기" />
                </div>
                <div className="flex-1 w-full flex flex-col justify-start border border-black rounded-lg gap-2 p-2">
                    {postList.length === 0
                 ? (<h3 className="text-bold text-2xl p-8 text-gray-400">게시글이 없습니다.</h3>)
                 : postList.map((post) => (
                        <Link
                            key={post.postPk} 
                            href={`/post-test/post/${post.postPk}`} 
                            className="block w-full grid grid-cols-[1fr_2fr_1fr] items-center hover:shadow-xl">        

                            <div className="truncate text-left">
                                {post.writerId}
                            </div>
                            <div className="truncate text-center font-bold">
                                {post.postTitle}
                            </div>
                            <div className="truncate text-right text-sm text-gray-500">
                                조회수 {post.postViewCount} / 작성일 {post.postCreatedAt}
                            </div>
                        </Link>
                 ))}
                 </div>
            </div>
            <div className="flex justify-center gap-1">
                {
                    maxPageCount <= 1
                    ? (
                        <Link 
                         href={`/post-test/1`}
                         className="w-6 h-6 rounded-sm border border-black hover:shadow-md bg-green-200  ">
                            1
                         </Link>
                    ) 
                    : maxPageCount <= 10 
                      ?  (
                            Array.from({ length: maxPageCount }, (_, index) => {
                                if(index+1 == Number(page)) {
                                        return (
                                            <Link 
                                            key={index+1}
                                            href={`/post-test/${index+1}`}
                                            className="flex w-6 h-6 rounded-sm border border-black hover:shadow-md bg-green-200 items-center justify-center">
                                                {index+1}
                                            </Link>
                                        )
                                    }
                                return (
                                    <Link 
                                    key={index+1}
                                    href={`/post-test/${index+1}`}
                                    className="flex w-6 h-6 rounded-sm border border-black hover:shadow-md bg-gray-200 items-center justify-center">
                                        {index+1}
                                    </Link>
                                )
                            })
                        )
                      : ( 
                        <> {/** 10개 이상 */}
                            {
                                1 < Number(page)
                                ? (<Link 
                                    href={`/post-test/${1}`}
                                    className="flex w-6 h-6 rounded-sm border border-black hover:shadow-md bg-gray-200 items-center justify-center">
                                        &lt;&lt;
                                </Link>
                                )
                                : null
                            }
                            {
                                1 < Number(page)
                                ? (<Link 
                                    href={`/post-test/${Number(page)-1}`}
                                    className="flex w-6 h-6 rounded-sm border border-black hover:shadow-md bg-gray-200 items-center justify-center">
                                        &lt;
                                </Link>
                                )
                                : null
                            }
                            
                            {Array.from({ length: 4 }, (_, index) => {
                                if(index+1 == Number(page)) {
                                    return (
                                        <Link 
                                        key={index+1}
                                        href={`/post-test/${index+1}`}
                                        className="flex w-6 h-6 rounded-sm border border-black hover:shadow-md bg-green-200 items-center justify-center">
                                            {index+1}
                                        </Link>
                                    )
                                }
                                else {
                                    return (
                                        <Link 
                                        key={index+1}
                                        href={`/post-test/${index+1}`}
                                        className="flex w-6 h-6 rounded-sm border border-black hover:shadow-md bg-gray-200 items-center justify-center">
                                            {index+1}
                                        </Link>
                                    )
                                }
                            })}
                            <span className="flex w-6 h-6 items-center justify-center">...</span>
                            {Array.from({ length: 4 }, (_, index) => {
                                if(maxPageCount - 4 + index == Number(page)) {
                                    return (
                                        <Link 
                                        key={maxPageCount - 4 + index}
                                        href={`/post-test/${maxPageCount - 4 + index}`}
                                        className="flex w-6 h-6 rounded-sm border border-black hover:shadow-md bg-green-200 items-center justify-center">
                                            {maxPageCount - 4 + index}
                                        </Link>
                                    )
                                }
                                else {
                                    return (
                                        <Link 
                                        key={maxPageCount - 4 + index}
                                        href={`/post-test/${maxPageCount - 4 + index}`}
                                        className="flex w-6 h-6 rounded-sm border border-black hover:shadow-md bg-gray-200 items-center justify-center">
                                            {maxPageCount - 4 + index}
                                        </Link>
                                    )
                                }
                            })}
                            {
                                Number(page) < maxPageCount
                                ? (<Link 
                                    href={`/post-test/${Number(page)+1}`}
                                    className="flex w-6 h-6 rounded-sm border border-black hover:shadow-md bg-gray-200 items-center justify-center">
                                        &gt;
                                </Link>
                                )
                                : null
                            }
                            {
                                Number(page) < maxPageCount
                                ? (<Link 
                                    href={`/post-test/${maxPageCount}`}
                                    className="flex w-6 h-6 rounded-sm border border-black hover:shadow-md bg-gray-200 items-center justify-center">
                                        &gt;&gt;
                                </Link>
                                )
                                : null
                            }
                            
                        </>
                        )
                }
                {/**maxPageCount={maxPageCount}**/}
                </div>
        </main>
    )
}