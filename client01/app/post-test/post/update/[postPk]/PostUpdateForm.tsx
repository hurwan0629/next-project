'use client'

import { Post } from "@/lib/types/post"
import { useState } from "react";
import { option2, defaultModalProps } from "@/components/DefaultModal";
import DefaultModal from "@/components/DefaultModal";
import { publicEnv } from "@/lib/env.public"
import { textTrunc } from "@/lib/util/stringEditor";
import { formatDefaultDateTime } from "@/lib/util/dateEditor"

export default function PostUpdateForm({ post }: { post: Post}) {

    const [postTitle, setpostTitle] = useState(post.postTitle);
    const [postContent, setPostContent] = useState(post.postContent);
    const [modal, setModal] = useState<defaultModalProps | null>(null);

    async function tryPostUpdate() {
        console.log("tryPostUpdate")
        console.log(`
            postPk: ${post.postPk}
            postTitle: ${postTitle}
            postContent: ${postContent}
            `)
        if(postContent.length <= 10) {
            setModal({
                modalTitle: "실패",
                modalMessage: "10자 이상을 입력해주세요",
                onClose: () => setModal(null)
            })
        }
        try {
            const response = await fetch(`${publicEnv.API_URL}/post/${post.postPk}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                method: "PATCH",
                body: JSON.stringify({
                    post: post.postPk,
                    postTitle: postTitle,
                    postContent: postContent
                })
            })

            setModal({
                modalTitle: "수정",
                modalMessage: "작업중입니다",
                modalLoading: true,
                onClose: () => setModal(null)
            })

            if(!response.ok) {
                if(response.status === 401) {
                    try {
                        const data = await response.json();
                        setModal({
                            modalTitle: "실패",
                            modalMessage: `${data?.message ?? "로그인 상태를 확인해주세요"}`,
                            onClose: () => setModal(null)
                        })
                    } catch(e) {
                        setModal({
                            modalTitle: "실패",
                            modalMessage: "로그인 상태를 확인해주세요",
                            onClose: () => setModal(null)
                        })
                    } 
                    return;
                }
                else {
                    setModal({
                        modalTitle: "실패",
                        modalMessage: "인터넷 문제가 발생하였습니다.",
                        onClose: () => setModal(null)
                    })
                }
            }

            const data = await response.json();
            setModal({
                modalTitle: "성공",
                modalMessage: `
                    postPk: ${data?.postPk}
                    postTitle: ${textTrunc(data?.postTitle, 10)}
                    postContent: ${textTrunc(data?.postContent, 10)}`,
                onClose: () => setModal(null)
            })

        } catch(e) {
            const message = e instanceof Error ? e.message : String(e)
            setModal({
                modalTitle: "실패",
                modalMessage: `${message}`,
                onClose: () => setModal(null)
            })
        }
    }

    return (
        <div className="flex flex-col w-[30%] h-full items-center py-4 gap-1">
            {/** 제목, 작성자id, 생성일자, 마지막 수정일자 */}
            <h6 className="font-bold text-lg">{post.postTitle}</h6>
            <p className="self-end m-0">작성자: {post.writerId}</p>
            <p className="self-end m-0">
                <span>작성일: {formatDefaultDateTime(post.postCreatedAt)}</span>
                <span>{post.postUpdatedAt && ("최종 수정일: " +formatDefaultDateTime(post.postUpdatedAt))}</span>
            </p>
            {/** 내용 (수정 가능하게) */}
            <textarea
                className="px-4 border border-gray rounded-lg bg-white w-full h-32"
                placeholder="여기에 수정할 내용을 작성하세요"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)} />
            {/** 수정요청 */}
            <button onClick={tryPostUpdate} 
                className="self-end p-2 rounded-md bg-green-300 border border-gray"
                >
                수정하기
            </button>
            {modal && (
                <DefaultModal
                    modalTitle={modal.modalTitle}
                    modalMessage={modal.modalMessage}
                    modalLoading={modal?.modalLoading}
                    onClose={modal?.onClose}
                    option2={modal?.option2} />
            )}
        </div>
    )
}