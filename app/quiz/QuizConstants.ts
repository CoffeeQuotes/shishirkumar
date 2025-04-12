export const categories = [
    "Laravel",
    "PHP",
    "MySQL",
    "JavaScript",
];

export const cardClasses = "border bg-card text-card-foreground rounded-lg shadow-sm";
export const cardHeaderClasses = "p-6";
export const cardTitleClasses = "text-xl lg:text-2xl font-semibold tracking-tight";
export const cardDescriptionClasses = "text-sm text-muted-foreground";
export const cardContentClasses = "p-6 pt-0";
export const cardFooterClasses = "flex items-center p-6 pt-0";
export const labelClasses = "block text-sm font-medium mb-1.5";
export const inputClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
export const selectClasses = `${inputClasses} appearance-none pr-8`;
export const buttonClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
export const primaryButtonClasses = `${buttonClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
export const secondaryButtonClasses = `${buttonClasses} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
export const ghostButtonClasses = `${buttonClasses} hover:bg-accent hover:text-accent-foreground`;
export const badgeClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
export const secondaryBadgeClasses = `${badgeClasses} border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80`;
export const alertClasses = "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";
export const successAlertClasses = `${alertClasses} bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-800 dark:text-green-300 [&>svg]:text-green-600 dark:[&>svg]:text-green-400`;
export const destructiveAlertClasses = `${alertClasses} bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300 [&>svg]:text-red-600 dark:[&>svg]:text-red-400`;