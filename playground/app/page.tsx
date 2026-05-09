'use client'

import { useAppSelector, useAppDispatch } from "@/store/hook";
import { increment, decrement, reset } from "@/store/countSlice";

export default function Home() {

  const count = useAppSelector((state) => state.count.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center gap-4 py-32 px-16 bg-white dark:bg-black justify-center">
        <div>
          현재 값: {count}
        </div>

        <button onClick={() => dispatch(increment())} className="w-8 y-4 cursor-pointer rounded-md border border-black">+</button>
        <button onClick={() => dispatch(decrement())} className="w-8 y-4 cursor-pointer rounded-md border border-black">-</button>
        <button onClick={() => dispatch(reset())} className="w-12 y-4 cursor-pointer rounded-md border border-black">reset</button>
      </main>
    </div>
  );
}
