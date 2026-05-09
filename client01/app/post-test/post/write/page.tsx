'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hook";
import { Member } from "@/store/authSlice"
import { defaultModalProps } from "@/components/DefaultModal";
import DefaultModal from "@/components/DefaultModal";
import { publicEnv } from "@/lib/env.public"

export default function writePostPage() {

    const [modal, setModal] = useState<defaultModalProps | null>(null);
    const router = useRouter();
    const { isLoggedIn, checked, member } = useAppSelector((state) => state.auth);
    
    useEffect(() => {
        if(!checked) {
            setModal({
                modalTitle: "알림",
                modalMessage: "권한 확인중입니다...",
                modalLoading: true,
            })
            return;
        };
        if(!isLoggedIn) {
            setModal({
                modalTitle: "알림",
                modalMessage: "글을 쓰기 위해선 로그인을 해야 합니다",
                onClose: () => router.push("/login")
            })
            return;
        }
        setModal(null);
    }, [checked, isLoggedIn, router])
    
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");

    async function tryCreatePost() {
        console.log("tryCreatePost")
        console.log(`postTitle: ${postTitle}`)
        console.log(`postContent: ${postContent}`)
        console.log(`member: ${member}`)
        console.log()
        try {
            const response = await fetch(`${publicEnv.API_URL}/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    postTitle,
                    postContent,
                    memberPk: member?.memberPk
                })
            })
            if(!response.ok) {
                if(response.status === 401) {
                    try {
                        const data = await response.json();
                        setModal({
                            modalTitle: "알림",
                            modalMessage: `${data?.message ? data.message : "인증되지 않은 사용자입니다."}`,
                            onClose: () => setModal(null)
                        })
                    }
                    catch (e) {
                        setModal({
                            modalTitle: "실패",
                            modalMessage: "인가 문제가 발생했습니다.",
                            onClose: () => setModal(null)
                        })
                    }
                    return;
                }
                setModal({
                    modalTitle: "실패",
                    modalMessage: "업로드에 실패하였습니다",
                    onClose: () => setModal(null)
                })
                return;
            }
            const data = await response.json()

            setModal({
                modalTitle: "성공",
                modalMessage: `message: ${data?.message} \n postPk: ${data?.postPk}`,
                onClose: () => setModal(null)
            })
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e)
            setModal({
                modalTitle: "포스팅 실패",
                modalMessage: message,
                onClose: () => setModal(null)
            })
        }
    }

    return (
        <main className="flex-1 w-[35%] flex flex-col items-center justify-start py-8">
            <div className="flex flex-col w-full h-full py-4 gap-2">
                <input type="text"
                    className="w-full px-2 border border-gray-300 rounded-md" 
                    placeholder="제목을 입력하세요"
                    value={postTitle}
                    onChange={(e)=> setPostTitle(e.target.value)}/>
                <textarea
                    className="w-full h-32 px-2 border border-gray-300 bg-white rounded-md"
                    placeholder="내용을 입력하세요"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)} />
                <button 
                    onClick={tryCreatePost}
                    className="self-end w-16 h-6 rounded-md border border-black bg-green-300">
                    포스팅하기        
                </button>
            </div>
            {modal && (
                <DefaultModal
                    modalTitle={modal.modalTitle}
                    modalMessage={modal.modalMessage}
                    modalLoading={modal?.modalLoading}
                    option2={modal?.option2}
                    onClose={modal.onClose} />
            )}
        </main>
    )
}