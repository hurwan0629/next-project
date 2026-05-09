'use client'

import { useState } from "react";
import { publicEnv } from "@/lib/env.public";
import DefaultModal from "@/components/DefaultModal";
import { useAppDispatch } from "@/store/hook";
import { loginSuccess } from "@/store/authSlice"
import { useRouter } from "next/navigation";

export default function LoginPage() {
    
    const [memberId, setMemberId] = useState("")
    const [memberPassword, setMemberPassword] = useState("")
    const [modal, setModal] = useState<{
        modalTitle: string
        modalMessage: string
        modalLoading?: boolean 
    } | null>(null)

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [loginDone, setLoginDone] = useState(false);

    async function tryLogin() {
        console.log("tryLogin()");

        setModal({
            modalTitle: "로그인",
            modalMessage: "로그인 시도중입니다...",
            modalLoading: true,
        })

        try {
            const response = await fetch(`${publicEnv.API_URL}/member/login`,{
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    memberId,
                    memberPassword
                })
            });

            const data = await response.json()
            console.log(data)
            
            if(response.status===401) {
                setModal({
                    modalTitle: "로그인 실패",
                    modalMessage: `${data.message}`
                })
                return;
            }
            
            if(!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }

            dispatch(loginSuccess({
                memberName: data.memberName,
                memberPk: data.memberPk
            }))

            setLoginDone(true);

            setModal({
                modalTitle: "로그인 성공",
                modalMessage: `환영합니다 ${data.memberName}님`
            })
        } catch (error) {
            console.log(error)
            setModal({
                modalTitle: "로그인 실패",
                modalMessage: `${error}`
            })
        }
    }

    return (
        <main className="w-full h-screen flex flex-col items-center justify-center">
            <div id="login-format" className="w-[500px] h-[70vh] rounded-lg bg-gray-200 flex flex-col items-center gap-4 p-4">
                <h3 className="text-xl font-bold">로그인</h3>
                {/** 아이디 */}
                <input type="text" onChange={(e) => setMemberId(e.target.value)}
                    placeholder="아이디를 입력하세요"
                    className="h-12 w-[70%] p-2 border border-gray-300 rounded bg-white p-4" />

                {/** 비밀번호 */}
                <input type="password" onChange={(e) => setMemberPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="h-12 w-[70%] p-2 border border-gray-300 rounded bg-white p-4" />

                {/** 로그인버튼 */}
                <button
                    onClick={tryLogin}
                    className="w-[35%] h-12 py-2 px-4 bg-green-400 border border-black rounded-lg">
                    로그인
                </button>
                
            </div>
            {modal && (
                <DefaultModal
                    modalTitle={modal.modalTitle}
                    modalMessage={modal.modalMessage}
                    modalLoading={modal.modalLoading}
                    onClose={() => {
                        setModal(null)

                        if (loginDone) {
                            router.push("/");
                        }
                    }} />
            )}
        </main>
    )
}