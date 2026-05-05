'use client'

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logout } from "@/store/authSlice";
import { publicEnv } from "@/lib/env.public";
import DefaultModal from "@/components/DefaultModal";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {

    const [modal, setModal] = useState<{
        modalTitle: string;
        modalMessage: string;
        modalLoading?: boolean;
        modalExitable?: boolean;
        onClose?: () => void;
    } | null>(null)

    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);

    async function tryLogout() {
        console.log("tryLogout()")
        

        if (!(authState.checked && authState.isLoggedIn)) {
            setModal({
                modalTitle: "잘못된 사용",
                modalMessage: "로그인 되어있지 않습니다.",
                modalExitable: true
            });
            return
        }

        setModal({
            modalTitle: "로그아웃",
            modalMessage: "로그아웃 중입니다...",
            modalLoading: true,
        });

        try {
            const response = await fetch(`${publicEnv.API_URL}/member/logout`, {
                method: "POST",
                credentials: "include"
            })

            if (response.status === 401) {
                setModal({
                    modalTitle: "문제 발생",
                    modalMessage: `
                    권한 관련 문제가 발생했습니다.
                    사용자 이름: ${authState.member?.memberName}`,
                    modalExitable: true
                });
            }

            const data = await response.json()

            console.log(data.message)

            setModal({
                modalTitle: "성공",
                modalMessage: `안녕히가세요 ${authState.member?.memberName}님`,
                modalExitable: true
            });

            dispatch(logout());
        } catch (error) {
            setModal({
                modalTitle: "에러",
                modalMessage: `${error}`,
                modalExitable: true,
            })
        }
    }

    return (
        <main className="flex-1 w-full flex items-center justify-center bg-red-400">
            <div className="flex flex-col items-center justify-start w-[500px] h-[70vh] rounded-lg bg-gray-200 gap-4 p-10">
                <h3 className="text-lg font-bold m-2">로그아웃</h3>
                <button 
                onClick={tryLogout}
                className="w-48 h-16 border border-black rounded-md bg-red-100">로그아웃</button>
            </div>

            {modal && (
                <DefaultModal
                    modalTitle={modal.modalTitle}
                    modalMessage={modal.modalMessage}
                    modalLoading={modal.modalLoading}
                    onClose={() => setModal(null)} />
            )}
        </main>
    )
}