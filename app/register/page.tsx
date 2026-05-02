'use client';
import { useState, useEffect } from "react";
import { publicEnv } from "@/lib/env.public";

export default function Register() {

    const [idWarning, setIdWarning] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [registCheck, setRegistCheck] = useState("");

    const [memberName, setMemberName] = useState("");
    const [memberId, setMemberId] = useState("");
    const [memberPassword, setMemberPassword] = useState("");
    const [memberPasswordCheck, setMemberPasswordCheck] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [memberEmailDomain, setMemberEmailDomain] = useState("");

    useEffect(() => {
        console.log("checkPassword()")
        console.log(`
            password: ${memberPassword}
            memberPasswordCheck: ${memberPasswordCheck}
            `)
        if(!memberPassword || !memberPasswordCheck) {
            setPasswordCheck("");
            return;
        }
        if(memberPassword==memberPasswordCheck) {
            setPasswordCheck("complete");
        }
        else {
            setPasswordCheck("notSame");
        }
    }, [memberPassword, memberPasswordCheck])

    function showState() {
        console.log(`
            memberName: ${memberName}
            memberId: ${memberId}
            memberPassword: ${memberPassword}
            memberPasswordCheck: ${memberPasswordCheck}
            memberEmail: ${memberEmail}
            memberEmailDomain: ${memberEmailDomain}
            `)
    }

    async function checkDuplicateId() {
        // console.log("중복체크 버튼 눌림")
        // console.log(memberId)
        // console.log(!memberId)
        if(!memberId) {
            setIdWarning("notComplete");
            return;
        }
        const response = await fetch(`${publicEnv.API_URL}/member/check-id?memberId=${memberId}`);
        
        const data = await response.json();

        if (data.duplicated) {
            setIdWarning("duplicate");
        }
        else {
            setIdWarning("complete");
        }
    }

    async function regist() {
        if(!memberName || !(idWarning==="complete") || !(passwordCheck==="complete") || !memberEmailDomain || !memberEmail) {
            setRegistCheck("fail")
            return;
        }
        const email = `${memberEmail}@${memberEmailDomain}`;

        try {
            setRegistCheck("pending")

            const response = await fetch(`${publicEnv.API_URL}/member/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    memberName,
                    memberId,
                    memberPassword,
                    memberEmail: email
                }),
            })

            if(!response.ok) {
                setRegistCheck("serverFail");
                return
            }

            const data = await response.json()
            console.log(data)
            
            setRegistCheck("complete")
        }
        catch (error) {
            console.log(error)
            setRegistCheck("serverFail")
        }
    }

    
    return (
        <main className="w-full h-screen flex items-center justify-center">
            <div className="w-[500px] h-[70vh] bg-gray-200 rounded-lg flex flex-col items-center justify-start gap-4 p-4">
                <h3 className="text-xl font-bold">회원가입</h3>
                {/**이름 */}
                <input type="text" onChange={(e) => setMemberName(e.target.value)} placeholder="이름" className="h-12 w-[70%] p-2 border border-gray-300 rounded bg-white p-4" />
                {/** 아이디 */}
                <div className="flex flex-col w-[70%] h-18 py-2 ">
                    <div className="flex w-full h-16 gap-1 items-center">
                        <input type="text" onChange={(e) => setMemberId(e.target.value)} placeholder="아이디" className="h-12 flex-1 p-2 border border-gray-300 rounded bg-white" />
                        <button onClick={checkDuplicateId} className="h-full w-24 prounded bg-green-500 px-3 text-white flex items-center justify-center rounded border border-transparent">중복 확인</button>
                    </div>
                    {idWarning==="notComplete"
                     ? (<p className="p-0 m-0 text-red-500">아이디를 제대로 입력해주세요</p>)
                     : idWarning==="duplicate"
                        ? (<p className="p-0 m-0 text-red-500">경고입니다</p>)
                        : idWarning==="complete"
                            ? (<p className="p-0 m-0 text-green-500">사용 가능한 아이디입니다</p>)
                            :  (<></>)
                    }
                </div>
                
                {/** 비밀번호 */}
                <input type="password" onChange={(e) => setMemberPassword(e.target.value) } placeholder="비밀번호" className="h-12 w-[70%] p-2 border border-gray-300 rounded bg-white p-4" />
                <input type="password" onChange={(e) => setMemberPasswordCheck(e.target.value) } placeholder="비밀번호 확인" className="h-12 w-[70%] p-2 border border-gray-300 rounded bg-white p-4" />
                {passwordCheck==="complete"
                 ? (<p className="p-0 m-0 text-green-500">비밀번호가 일치합니다</p>)
                 : passwordCheck==="notSame"
                    ? (<p className="p-0 m-0 text-red-500">비밀번호가 일치하지 않습니다</p>)
                    : (<></>)
                }
                {/** 이메일 */}
                <div className="flex w-[70%] h-16 gap-2 py-2 items-center overflow-hidden" >
                    <input type="text" onChange={(e) => setMemberEmail(e.target.value)} className="w-[40%] h-full border border-gray-300 rounded bg-white p-2" /> <p>@</p>
                    <input type="text" onChange={(e) => setMemberEmailDomain(e.target.value)} value={memberEmailDomain} placeholder="직접 입력" className="w-[30%] h-full border border-gray-300 rounded bg-white" />
                    <select className="w-[25%] h-full border border-gray-300 rounded bg-white" onChange={(e) => setMemberEmailDomain(e.target.value)}>
                        <option value="naver.com">Naver</option>
                        <option value="gmail.com">Gmail</option>
                        <option value="daum.net">Daum</option>
                        <option value="">직접 입력</option>
                    </select>
                </div>
                <button onClick={regist} className="w-32 h-12 rounded border border-black bg-green-300">회원가입 하기</button>
                {registCheck==="fail"
                 ? (<p className="p-0 m-0 text-red-500">조건이 만족되지 않았습니다</p>)
                 : registCheck==="pending"
                   ? (<p className="p-0 m-0 text-green-500">회원가입중</p>)
                   : registCheck==="serverFail"
                     ? (<p className="p-0 m-0 text-red-500">서버 처리중 오류가 있었습니다.</p>)
                     : (<></>)}
                <button onClick={showState} className="w-32 h-16 rounded border border-black bg-blue-300">State 확인하기</button>
            </div>
        </main>
    )
}