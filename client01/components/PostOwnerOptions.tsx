'use client'

import LinkButton from "./LinkButton";
import { useAppSelector } from "@/store/hook";
import { publicEnv } from "@/lib/env.public";
import DefaultModal from "@/components/DefaultModal";
import { useState } from "react";
import { option2 } from "@/components/DefaultModal";

type Props = {
    writerPk: number;
    postPk: number;
}

export default function PostOwnerOptions({ writerPk, postPk }: Props) {

    const [modal, setModal] = useState<{
        modalTitle: string;
        modalMessage: string;
        modalLoading?: boolean;
        option2?: option2;
        onClose: () => void;
    } | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    const memberPk = useAppSelector((state) => state.auth.member?.memberPk)

    const isWriter = memberPk === writerPk;

    if (!isWriter) return null;

    function openDeleteModal() {
        setModal({
            modalTitle: "삭제",
            modalMessage: "정말 이 게시물을 삭제하시겠습니까?",
            option2: {
                optionText: "삭제",
                optionColor: "bg-red-400",
                onOption: tryDeletePost
            },
            onClose: () => setModal(null)
        })
    }

    async function tryDeletePost() {
        console.log("tryDeletePost")

        try {
            setModal({
                modalTitle: "삭제",
                modalMessage: "게시글을 삭제중입니다",
                modalLoading: true,
                onClose: () => setModal(null)
            })

            const response = await fetch(`${publicEnv.API_URL}/post/${postPk}`, {
                method: "DELETE",
                credentials: "include"
            })

            if(!response.ok) {
                let message = `${response.status}`;
                try {
                    const data = await response.json()

                    message = data.message ?? message;
                } catch {}

                setModal({
                    modalTitle: "삭제",
                    modalMessage: `삭제중 문제가 발생하였습니다. ${message}`,
                    onClose: () => setModal(null)
                })
                return;
            }

            const data = await response.json()
            
            if(!data.postDeleted) {
                setModal({
                    modalTitle: "문제",
                    modalMessage: `삭제가 정상적으로 이루어지지 않았습니다. PostPk: ${data.postPk}`,
                    onClose: () => setModal(null)
                })
            }

            setModal({
                modalTitle: "삭제",
                modalMessage: `삭제 완료했습니다. PostPk: ${data.postPk}`,
                onClose: () => setModal(null)
            })

        } catch (error) {
            console.log(error)
            
            setModal({
                modalTitle: "삭제 실패",
                modalMessage: `${error}`,
                onClose: () => setModal(null),
            });
        }
    }

    return (
        <>
        <div className="flex items-center justify-center">
            <LinkButton href={`/post-test/post/update/${postPk}`} text="수정" />
            <button onClick={openDeleteModal} className="p-4 bg-red-400 rounded-lg text-center h-12 flex items-center justify-center">삭제</button>
        </div>
            {modal && (
                <DefaultModal 
                    modalTitle={modal.modalTitle}
                    modalMessage={modal.modalMessage}
                    modalLoading={modal.modalLoading} 
                    option2={modal.option2}
                    onClose={modal.onClose} />
            )}
        </>
    )
}