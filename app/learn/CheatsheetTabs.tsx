import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Accordion} from "@/components/ui/accordion";
import CheatsheetSection from "@/app/learn/CheatsheetSection";
import {CheatsheetTabsProps} from "@/lib/definitions";


function CheatsheetTabs({
                            filteredData,
                            allData,
                            searchTerm,
                            defaultAccordionValues,
                            copyState,
                            onCopyCode
                        }: CheatsheetTabsProps) {
    return (
        <Tabs defaultValue={filteredData[0]?.id || ""} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                {allData.map((tab) => {
                    const isVisible = filteredData.some(filteredTab => filteredTab?.id === tab.id);
                    if (!isVisible && searchTerm) return null;

                    return (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className={tab.colorClasses.triggerActive}
                        >
                            {tab.title}
                        </TabsTrigger>
                    );
                })}
            </TabsList>

            {filteredData.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                    <div className="space-y-8">
                        <div
                            className={`${tab.colorClasses.introBg} ${tab.colorClasses.introBorder} p-4 rounded-lg border`}
                        >
                            <p className={`${tab.colorClasses.introText} italic`}>{tab.intro}</p>
                        </div>

                        <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                            defaultValue={defaultAccordionValues[tab.id]}
                            key={`${tab.id}-${defaultAccordionValues[tab.id] || 'default'}`}
                        >
                            {tab.sections.map((section) => (
                                <CheatsheetSection
                                    key={section.id}
                                    section={{
                                        id: section.id,
                                        title: section.title || "",
                                        items: section.items || []
                                    }}
                                    tab={tab.id}
                                    copyState={{id: section.id, ...copyState}}
                                    onCopyCode={onCopyCode}
                                />
                            ))}
                        </Accordion>
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    )
}

export default CheatsheetTabs;