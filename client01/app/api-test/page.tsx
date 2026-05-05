'use client'

import { publicEnv } from "@/lib/env.public"
import { useState } from "react";

export default function ApiTest() {

    const [x, setX] = useState(1);

    const sleep = (ms:number): Promise<void> => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function sendDummy() {
        if(x<1) {
            return
        }
        const start = Date.now();
        console.log(start)
        try{
            let pl: Promise<Response>[]
             = []
            for(let i: number=0;i<x;i++){
                console.log(`test ${i+1}`)
                pl.push(fetch(`${publicEnv.API_URL}/test`));

                // if(!response.ok){
                //     console.log("response.ok == false")
                //     return
                // }
                // const data = await response.json();
                // console.log(`response.json: ${data}`)
                sleep(10)
            }
            console.log("start")
            const responses = await Promise.all(pl);

            console.log(`ok: ${responses.filter((response) => response.ok).length}개`)
        }
        finally {
            const end = Date.now();
            console.log(end)
            console.log("end")
            console.log(`time: ${end-start-(10*x)}`)
        }
    }

    return (
        <main className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-300 gap-4">
            <button onClick={sendDummy} className="cursor-pointer w-32 h-16 border border-black bg-green-400 hover:shadow-xl">서버에 더미 요청 보내기</button>
            <input type="number" onChange={(e) => setX(Number(e.target.value))} className="w-32 h-16 bg-white border border-white" placeholder="몇번 보낼까요? (0.01초에 한번)" />
        </main>
    )
}