"use client"

import { useState, useMemo, useCallback } from "react"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import cheatsheetData from "./cheatsheet.json" 
import { exportCheatsheetToPdf } from "@/lib/pdf-exporter" // Extracted PDF logic
import { useDebounce } from "@/hooks/use-debounce"
import CheatsheetTabs from "@/app/learn/CheatsheetTabs";
import SearchBar from "@/app/learn/SearchBar";
import ThemeToggle from "@/components/ui/ThemeToggle"; // Custom hook for debouncing
import PdfExportButton from "./PdfExportButton"
import NoResultsMessage from "./NoResultsMessage"
import {CopyState, Section, Tab, TabData} from "@/lib/definitions";

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


  const filterContent = useCallback((tab: Tab) => {
    if (!debouncedSearchTerm) return tab

    const lowercaseSearchTerm = debouncedSearchTerm.toLowerCase()

    const filteredSections = tab.sections
      .map((section: Section) => {
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
    return cheatsheetData.map(filterContent).filter((tab) => tab !== null) as unknown as TabData[]
  }, [filterContent])

  // Calculate default accordion values for search results
  const defaultAccordionValues = useMemo(() => {
    if (!debouncedSearchTerm) return {}

    const values: Record<string, string> = {}
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
        setCopyState({ [id]: true });

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
            const updatedState = { ...prev };
            delete updatedState[id];
            return updatedState;
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
            <ThemeToggle theme={theme || "light"} setTheme={setTheme} />
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







