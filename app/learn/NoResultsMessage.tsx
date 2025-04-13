function NoResultsMessage({ searchTerm }: { searchTerm: string }) {
    return (
        <div className="text-center py-10 text-muted-foreground">
            No results found for "{searchTerm}".
        </div>
    )
}
export default NoResultsMessage;