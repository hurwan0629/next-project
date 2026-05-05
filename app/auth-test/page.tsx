'use client'

import { useState } from "react";
import { publicEnv } from "@/lib/env.public"

export default function AuthTestPage() {

    const [memberInfo, setMemberInfo] = useState("");

    async function fetchMemberInfo() {
        const response = await fetch(`${publicEnv.API_URL}/member/me`, {
            credentials: "include",
        })

        if(response.status===401) {
            setMemberInfo("로그인을 해주세요");
            return
        }
        else if(!response.ok) {
            setMemberInfo(`
                response.status: ${response.status}
                에러가 발생했습니다.`)
            return
        }

        const data = await response.json()

        setMemberInfo(JSON.stringify(data, null, 2));

    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-start w-[500px] h-[70vh] bg-gray-200 rounded-lg gap-4 p-4">
                <h3 className="text-lg font-bold">인증 테스트</h3>
                <button 
                onClick={fetchMemberInfo}
                className="cursor-pointer h-12 w-[70%] rounded-md bg-green border-black">
                    내 정보 요청하기
                </button>
                <div className="flex flex-col m-2 items-center justify-start">
                    <h4>내 정보</h4>
                    <div className="w-full h-full border-black rounded-md bg-white p-2 m-2 shadow-inner ring-black/50">
                    {memberInfo 
                     ? <p className="break-all whitespace-pre-wrap">{memberInfo}</p>
                     : <p>아직 사용자의 정보를 불러오지 않았습니다</p>}
                    </div>
                </div>
            </div>
        </main>
    )
}