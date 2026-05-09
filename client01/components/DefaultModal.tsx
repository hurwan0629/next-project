'use client'

type loadingState = {
    onLoading: string;
    finishLoading: string;
}

export type option2 = {
    optionText: string;
    optionColor?: string;
    onOption: () => void;
}

export type defaultModalProps = {
    modalTitle: string
    modalMessage: string;
    modalLoading?: boolean;
    modalExitable?: boolean;
    option2?: option2;
    onClose?: () => void;
}

export default function DeafultModal({
    modalTitle, 
    modalMessage, 
    modalLoading = false, 
    modalExitable = true,
    option2,
    onClose}: defaultModalProps) {

        const optionColorClass = option2?.optionColor ? option2?.optionColor : "bg-gray-900";
    return (
        <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center justify-start w-[360px] rounded-lg bg-white p-6 shadow-lg">
                <h3 className="text-lg font-bold m-4">{modalTitle}</h3>
                <p>{modalMessage}</p>
                {modalLoading && (
                    <span className="h-4 w-4 animate-spin rounded-full gorder-2 gorder-white border-t-transparent" />
                )}
                {modalExitable && !modalLoading && (
                    <div className="flex items-center justify-center p-4 gap-4">
                        <button
                            onClick={onClose}
                            className="mt-6 rounded bg-gray-900 px-4 py-2 text-white">
                            닫기        
                        </button>
                        {
                            option2 && (
                                <button
                                    onClick={() => {
                                        option2?.onOption();
                                        onClose?.();
                                    }}
                                    className={`mt-6 rounded ${optionColorClass} px-4 py-2 text-black`}>
                                    {option2?.optionText}
                                </button>
                            )
                        }
                    </div>

                )}
            </div>
        </main>
    )
}