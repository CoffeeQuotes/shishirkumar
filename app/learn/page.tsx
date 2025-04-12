"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useTheme } from "next-themes"
import { Download, Moon, Sun, Search, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import cheatsheetData from "./cheatsheet.json" 
import { exportCheatsheetToPdf } from "@/lib/pdf-exporter" // Extracted PDF logic
import { useDebounce } from "@/hooks/use-debounce" // Custom hook for debouncing

export default function CheatsheetPage() {
  const { theme, setTheme } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [isPdfExporting, setIsPdfExporting] = useState(false)
  const { toast } = useToast()
  const [copyState, setCopyState] = useState<{ id: string | null; timestamp: number }>({
    id: null,
    timestamp: 0
  })
  
  // Use a proper debounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // --- Filter Content Function ---
  const filterContent = useCallback((tab) => {
    if (!debouncedSearchTerm) return tab 

    const lowercaseSearchTerm = debouncedSearchTerm.toLowerCase()

    const filteredSections = tab.sections
      .map((section) => {
        const sectionTitleMatches = section.title.toLowerCase().includes(lowercaseSearchTerm)
        const filteredItems = section.items.filter(
          (item) =>
            item.concept.toLowerCase().includes(lowercaseSearchTerm) ||
            item.description.toLowerCase().includes(lowercaseSearchTerm) ||
            (item.note && item.note.toLowerCase().includes(lowercaseSearchTerm)) ||
            item.code.toLowerCase().includes(lowercaseSearchTerm),
        )

        if (sectionTitleMatches || filteredItems.length > 0) {
          return sectionTitleMatches ? section : { ...section, items: filteredItems }
        }
        return null 
      })
      .filter((section) => section !== null) 

    return filteredSections.length > 0 ? { ...tab, sections: filteredSections } : null
  }, [debouncedSearchTerm])

  // Memoize filtered data to avoid unnecessary recalculations
  const filteredData = useMemo(() => {
    return cheatsheetData.map(filterContent).filter((tab) => tab !== null)
  }, [filterContent])

  // Calculate default accordion values for search results
  const defaultAccordionValues = useMemo(() => {
    if (!debouncedSearchTerm) return {}
    
    const values = {}
    filteredData.forEach(tab => {
      if (tab.sections.length > 0) {
        values[tab.id] = tab.sections[0].id
      }
    })
    
    return values
  }, [debouncedSearchTerm, filteredData])

  // --- PDF Export Handler ---
  const handleExportPDF = useCallback(async () => {
    if (isPdfExporting) return
    
    setIsPdfExporting(true)
    
    toast({
      title: "Generating PDF",
      description: "Creating PDF from cheatsheet data...",
      duration: 15000,
    })

    try {
      // Use a Web Worker or dedicated library function
      await exportCheatsheetToPdf(cheatsheetData)
      
      toast({
        title: "PDF Downloaded",
        description: "Cheatsheet successfully exported to PDF.",
      })
    } catch (error) {
      console.error("PDF generation error:", error)
      
      toast({
        title: "PDF Generation Failed",
        description: error instanceof Error ? error.message : "Could not generate PDF from data.",
        variant: "destructive",
      })
    } finally {
      setIsPdfExporting(false)
    }
  }, [isPdfExporting, toast])

  // --- Safe Copy Code Handler ---
  const copyCode = useCallback((code, id) => {
    // Use a more secure method for clipboard functionality
    const copyToClipboard = async (text) => {
      try {
        // Try the modern clipboard API first (requires secure context / HTTPS)
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        } 
        
        // Fallback to the older document.execCommand method
        else {
          // Create a temporary textarea element
          const textArea = document.createElement("textarea");
          textArea.value = text;
          
          // Make it invisible
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          // Execute the copy command
          const success = document.execCommand("copy");
          
          // Clean up
          document.body.removeChild(textArea);
          return success;
        }
      } catch (error) {
        console.error("Could not copy text: ", error);
        return false;
      }
    };
    
    // Attempt to copy and update UI
    copyToClipboard(code).then(success => {
      if (success) {
        // Update state and show success feedback
        setCopyState({ id, timestamp: Date.now() });
        
        // Show toast
        toast({
          title: "Code Copied",
          description: "Code snippet copied to clipboard!",
          duration: 2000,
        });
        
        // Auto-reset the copy state after 2 seconds
        setTimeout(() => {
          setCopyState(prev => {
            // Only reset if this is still the same copy operation
            if (prev.id === id) {
              return { id: null, timestamp: 0 };
            }
            return prev;
          });
        }, 2000);
      } else {
        // Show error feedback if copy failed
        toast({
          title: "Copy Failed",
          description: "Could not copy to clipboard. Try selecting the code manually.",
          variant: "destructive",
        });
      }
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold">Tech Cheatsheet</h1>
          <div className="flex items-center gap-4">
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <PdfExportButton 
              onExport={handleExportPDF} 
              isExporting={isPdfExporting} 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6"> 
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Laravel, PHP, MySQL & JS Cheatsheet</h1>
          <p className="text-muted-foreground">Comprehensive revision guide created by Shishir Kumar</p>
        </div>

        {filteredData.length > 0 ? (
          <CheatsheetTabs 
            filteredData={filteredData}
            allData={cheatsheetData}
            searchTerm={searchTerm}
            defaultAccordionValues={defaultAccordionValues}
            copyState={copyState}
            onCopyCode={copyCode}
          />
        ) : (
          <NoResultsMessage searchTerm={searchTerm} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Laravel, PHP, MySQL & JavaScript Cheatsheet - All the important concepts for your interview preparation
          </p>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            <span className="font-bold text-foreground">Thank You! Best of Luck! 🚀</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

// --- Extracted Components ---

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <>
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          aria-label="Search all content"
          type="search"
          placeholder="Search all content..." 
          className="w-full pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />     
      </div>
      <Button onClick={() => setSearchTerm("")} className="ml-4">
        Clear Search
      </Button>
    </>
  )
}

function ThemeToggle({ theme, setTheme }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            aria-label="Toggle dark/light theme" 
            variant="outline" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function PdfExportButton({ onExport, isExporting }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={onExport} 
            disabled={isExporting}
            className="relative"
          >
            {isExporting ? (
              <div className="flex items-center">
                <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </div>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download as PDF</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function NoResultsMessage({ searchTerm }) {
  return (
    <div className="text-center py-10 text-muted-foreground">
      No results found for "{searchTerm}".
    </div>
  )
}

function CheatsheetTabs({ 
  filteredData, 
  allData, 
  searchTerm, 
  defaultAccordionValues,
  copyState,
  onCopyCode
}) {
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
                  section={section}
                  tab={tab}
                  copyState={copyState}
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

function CheatsheetSection({ section, tab, copyState, onCopyCode }) {
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
                  item={item}
                  index={index}
                  isLast={index === section.items.length - 1}
                  tab={tab}
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

function CheatsheetItem({ item, index, isLast, tab, isCopied, onCopyCode }) {
  // Handles selecting text manually in case copy fails
  const selectCodeText = (event) => {
    if (!navigator.clipboard) {
      // If clipboard API isn't available, help user by selecting the text
      const codeElement = event.currentTarget.parentNode;
      const range = document.createRange();
      range.selectNodeContents(codeElement);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
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