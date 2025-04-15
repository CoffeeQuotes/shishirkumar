import { Eraser, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SearchBar({ searchTerm, setSearchTerm }: { searchTerm: string, setSearchTerm: (value: string) => void }) {
    return (
        <>
            <div className="relative w-full max-w-sm mb-4">
                <Input
                    aria-label="Search all content, press enter to search"
                    type="search"
                    placeholder="Search all content..."
                    className="brave-search-input w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Button onClick={() => setSearchTerm("")} className="btn-brave font-medium text-white">
                <Eraser />
                Clear Search
            </Button>
        </>
    )
}

export default SearchBar;
