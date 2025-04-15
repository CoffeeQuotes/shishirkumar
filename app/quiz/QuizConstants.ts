export const categories = [
    "Laravel",
    "PHP",
    "MySQL",
    "JavaScript",
  ];
  
  // ✅ Use your custom Brave card component
  export const cardClasses = "brave-card";
  export const cardHeaderClasses = "p-6";
  export const cardTitleClasses = "text-xl lg:text-2xl font-semibold tracking-tight";
  export const cardDescriptionClasses = "text-sm text-muted-foreground";
  export const cardContentClasses = "p-6 pt-0";
  export const cardFooterClasses = "flex items-center p-6 pt-0";
  
  // ✅ Matches label style with theme
  export const labelClasses = "block text-sm font-medium text-foreground mb-1.5";
  
  // ✅ Brave input with glass effect & ring
  export const inputClasses = "brave-search-input";
  
  // ✅ Extends the input styling for selects
  export const selectClasses = `${inputClasses} appearance-none pr-8`;
  
  // ✅ Base button using your own utility class system
  export const buttonClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  // ✅ Uses .btn-brave and .btn-brave-secondary
  export const primaryButtonClasses = "btn-brave";
  export const secondaryButtonClasses = "btn-brave-secondary";
  
  // ✅ Ghost still uses utility classes — can make a `.btn-ghost` if needed
  export const ghostButtonClasses = `${buttonClasses} hover:bg-accent hover:text-accent-foreground`;
  
  // ✅ Brave-style badges could be extracted into a new `.badge` class if needed
  export const badgeClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  export const secondaryBadgeClasses = `${badgeClasses} border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80`;
  
  // ✅ Alert classes still use utility classes; you can convert them to `.alert`, `.alert-success`, etc.
  export const alertClasses = "relative w-full rounded-lg border border-border bg-background p-4 text-foreground [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";
  
  export const successAlertClasses = `${alertClasses} bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-800 dark:text-green-300 [&>svg]:text-green-600 dark:[&>svg]:text-green-400`;
  
  export const destructiveAlertClasses = `${alertClasses} bg-destructive text-destructive-foreground border border-destructive dark:bg-red-950/30 dark:border-red-800 dark:text-red-300 [&>svg]:text-red-600 dark:[&>svg]:text-red-400`;
  