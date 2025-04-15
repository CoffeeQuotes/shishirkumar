import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CheatsheetItem from "@/app/learn/CheatsheetItem";
import { CheatsheetSectionProps } from "@/lib/definitions";

function CheatsheetSection({ section, tab, copyState, onCopyCode }: CheatsheetSectionProps) {
    return (
        <AccordionItem value={section.id}>
        <AccordionTrigger className="text-xl font-semibold">
        {section.title}
        </AccordionTrigger>
        <AccordionContent>
        <div className="space-y-4">
        {/* Header - Hidden on mobile, visible on larger screens */}
        <div className="hidden md:grid md:grid-cols-3 bg-muted/50 rounded-t-md p-3 border border-b-0">
        <div className="font-semibold">Concept</div>
        <div className="font-semibold">Description</div>
        <div className="font-semibold">Example</div>
        </div>

        {/* Card-based layout for items */}
        <div className="space-y-4">
        {section.items.map((item, index) => (
            <div
            key={item.copyId}
            className="border rounded-md overflow-hidden bg-card"
            >
            {/* Mobile layout - Stack vertically */}
            <div className="block md:hidden">
            <div className="p-3 border-b bg-muted/30">
            <h4 className="font-medium">{item.concept}</h4>
            </div>
            <div className="p-3 border-b">
            <div className="text-sm text-muted-foreground mb-2">Description</div>
            <div>{item.description}</div>
            </div>
            <div className="p-3">
            <div className="text-sm text-muted-foreground mb-2">Example</div>
            <div className="flex justify-between items-start">
            <pre className="text-sm flex-1 overflow-x-auto p-2 bg-muted/20 rounded">
            <code>{item.code}</code>
            </pre>
            <button
            onClick={() => onCopyCode(item.copyId, item.code)}
            className="ml-2 p-1 text-xs text-muted-foreground hover:text-foreground"
            >
            {copyState.id === item.copyId ? "Copied!" : "Copy"}
            </button>
            </div>
            {item.note && (
                <div className={`mt-2 text-sm italic ${tab}`}>
                Note: {item.note}
                </div>
            )}
            </div>
            </div>

            {/* Desktop layout - Grid */}
            <div className="hidden md:grid md:grid-cols-3 md:divide-x">
            <div className="p-3">{item.concept}</div>
            <div className="p-3">{item.description}</div>
            <div className="p-3">
            <div className="flex justify-between items-start">
            <pre className="text-sm flex-1 overflow-x-auto p-2 bg-muted/20 rounded">
            <code>{item.code}</code>
            </pre>
            <button
            onClick={() => onCopyCode(item.copyId, item.code)}
            className="ml-2 p-1 text-xs text-muted-foreground hover:text-foreground"
            >
            {copyState.id === item.copyId ? "Copied!" : "Copy"}
            </button>
            </div>
            {item.note && (
                <div className={`mt-2 text-sm italic ${tab}`}>
                Note: {item.note}
                </div>
            )}
            </div>
            </div>
            </div>
        ))}
        </div>
        </div>
        </AccordionContent>
        </AccordionItem>
    );
}

export default CheatsheetSection;
