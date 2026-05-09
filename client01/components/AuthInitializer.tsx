'use client'

import { useEffect } from "react";
import { publicEnv } from "@/lib/env.public";
import { useAppDispatch } from "@/store/hook";
import { authChecked, loginSuccess } from "@/store/authSlice";

export default function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch(`${publicEnv.API_URL}/member/me`, {
                    credentials: "include",
                })

                if (response.status === 401) {
                    dispatch(authChecked());
                    return;
                }
                
                if (!response.ok) {
                    dispatch(authChecked());
                    return;
                }

                const data = await response.json();
                dispatch(loginSuccess({
                    memberName: data?.memberName,
                    memberPk: data?.memberPk
                }))
            } catch {
                dispatch(authChecked());
            }
        }

        checkAuth()
    }, [dispatch])

    return null;
}