import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import CheatsheetItem from "@/app/learn/CheatsheetItem";
import {CheatsheetSectionProps} from "@/lib/definitions";


function CheatsheetSection({ section, tab, copyState, onCopyCode }: CheatsheetSectionProps) {
    return (
        <AccordionItem value={section.id}>
            <AccordionTrigger className="text-xl font-semibold">
                {section.title}
            </AccordionTrigger>
            <AccordionContent>
                <div className="rounded-md border">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-3 text-left font-semibold">Concept</th>
                            <th className="p-3 text-left font-semibold">Description</th>
                            <th className="p-3 text-left font-semibold">Example</th>
                        </tr>
                        </thead>
                        <tbody>
                        {section.items.map((item, index) => (
                            <CheatsheetItem
                                key={item.copyId}
                                item={{
                                    concept: item.concept,
                                    description: item.description,
                                    code: item.code,
                                    note: item.note,
                                    copyId: item.copyId
                                }}
                                index={index}
                                isLast={index === section.items.length - 1}
                                tab={{ colorClasses: { noteText: tab } }}
                                isCopied={copyState.id === item.copyId}
                                onCopyCode={onCopyCode}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}
export default CheatsheetSection;