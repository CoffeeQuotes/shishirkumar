import { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import CheatsheetSection from "@/app/learn/CheatsheetSection";
import { CheatsheetTabsProps } from "@/lib/definitions";

function CheatsheetTabs({
  filteredData,
  allData,
  searchTerm,
  defaultAccordionValues,
  copyState,
  onCopyCode,
}: CheatsheetTabsProps) {
  const [activeTab, setActiveTab] = useState(filteredData[0]?.id || "");
  const cardClasses = "brave-card";
  const cardDescriptionClasses = "text-sm text-muted-foreground";

  // Update active tab when filteredData changes
  useEffect(() => {
    if (filteredData.length > 0 && !filteredData.some(tab => tab.id === activeTab)) {
      setActiveTab(filteredData[0].id);
    }
  }, [filteredData, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Find the currently active tab data
  const currentTabData = filteredData.find(tab => tab.id === activeTab);

  return (
    <Tabs
    value={activeTab}
    onValueChange={handleTabChange}
    className="w-full"
    >
    <TabsList className="flex w-full overflow-x-auto gap-2 sm:grid sm:grid-cols-3 md:grid-cols-4 scrollbar-hide">
    {allData.map((tab) => {
      const isVisible = filteredData.some(
        (filteredTab) => filteredTab?.id === tab.id
      );
      if (!isVisible && searchTerm) return null;

      return (
        <TabsTrigger
        key={tab.id}
        value={tab.id}
        className={`text-sm font-medium px-4 py-2 rounded-md transition-colors whitespace-nowrap truncate sm:text-center ${tab.colorClasses.triggerActive}`}
        >
        {tab.title}
        </TabsTrigger>
      );
    })}
    </TabsList>

    {/* Only render the active tab content */}
    {currentTabData && (
      <TabsContent key={currentTabData.id} value={currentTabData.id} className="mt-6">
      <div className="space-y-8">
      {/* Section Intro using card design */}
      <div
      className={`${cardClasses} ${currentTabData.colorClasses.introBg} ${currentTabData.colorClasses.introBorder}`}
      >
      <p
      className={`${cardDescriptionClasses} italic ${currentTabData.colorClasses.introText} p-4`}
      >
      {currentTabData.intro}
      </p>
      </div>

      {/* Accordion Sections */}
      <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={defaultAccordionValues[currentTabData.id]}
      >
      {currentTabData.sections.map((section) => (
        <CheatsheetSection
        key={section.id}
        section={{
          id: section.id,
          title: section.title || "",
          items: section.items || [],
        }}
        tab={currentTabData.id}
        copyState={{ id: section.id, ...copyState }}
        onCopyCode={onCopyCode}
        />
      ))}
      </Accordion>
      </div>
      </TabsContent>
    )}
    </Tabs>
  );
}

export default CheatsheetTabs;
