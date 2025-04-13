import {Check, Copy} from "lucide-react";

function CheatsheetItem({ item, index, isLast, tab, isCopied, onCopyCode }: {
    item: { concept: string; description: string; note?: string; code: string; copyId: string };
    index: number;
    isLast: boolean;
    tab: { colorClasses: { noteText: string } };
    isCopied: boolean;
    onCopyCode: (code: string, copyId: string) => void;
}) {
    // Handles selecting text manually in case copy fails
    const selectCodeText = (event: React.MouseEvent) => {
        if (!navigator.clipboard) {
            // If clipboard API isn't available, help user by selecting the text
            const codeElement = event.currentTarget.parentNode;
            if (codeElement) {
                const range = document.createRange();
                range.selectNodeContents(codeElement);
                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }
    };

    return (
        <tr className={!isLast ? "border-b" : ""}>
            <td className="p-3 align-top w-1/4">{item.concept}</td>
            <td className="p-3 align-top w-1/3">
                <p>{item.description}</p>
                {item.note && (
                    <p className={`${tab.colorClasses.noteText} italic mt-1`}>{item.note}</p>
                )}
            </td>
            <td className="p-3 align-top relative w-5/12">
                <div
                    className="bg-muted rounded p-2 font-mono text-sm relative group whitespace-pre-wrap break-words"
                    onDoubleClick={selectCodeText}
                >
                    {item.code}
                    <button
                        title="Copy code"
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground copy-btn"
                        onClick={() => onCopyCode(item.code, item.copyId)}
                    >
                        {isCopied ? (
                            <div className="flex flex-row">
                                Copied!
                                <Check className="h-4 w-4 text-green-500" />
                            </div>
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default CheatsheetItem;