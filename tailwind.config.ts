import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    // "*.{js,ts,jsx,tsx,mdx}", // Consider refining this if build times are slow
  ],
  prefix: "",
  safelist: [
    // --- Active Tab Trigger States (Already Added) ---
    'data-[state=active]:bg-blue-100', 'data-[state=active]:text-blue-900',
    'dark:data-[state=active]:bg-blue-900', 'dark:data-[state=active]:text-blue-100',
    'data-[state=active]:bg-green-100', 'data-[state=active]:text-green-900',
    'dark:data-[state=active]:bg-green-900', 'dark:data-[state=active]:text-green-100',
    'data-[state=active]:bg-amber-100', 'data-[state=active]:text-amber-900',
    'dark:data-[state=active]:bg-amber-900', 'dark:data-[state=active]:text-amber-100',
    'data-[state=active]:bg-red-100', 'data-[state=active]:text-red-900',
    'dark:data-[state=active]:bg-red-900', 'dark:data-[state=active]:text-red-100',

    // --- NEW: Intro/Note Styling Classes (Add these) ---
    // Laravel Intro/Note
    'bg-blue-50', 'dark:bg-blue-950',
    'border-blue-200', 'dark:border-blue-800',
    'text-blue-600', 'dark:text-blue-400',
    // PHP Intro/Note
    'bg-green-50', 'dark:bg-green-950',
    'border-green-200', 'dark:border-green-800',
    'text-green-600', 'dark:text-green-400',
    // MySQL Intro/Note
    'bg-amber-50', 'dark:bg-amber-950',
    'border-amber-200', 'dark:border-amber-800',
    'text-amber-600', 'dark:text-amber-400',
    // JavaScript Intro/Note
    'bg-red-50', 'dark:bg-red-950',
    'border-red-200', 'dark:border-red-800',
    'text-red-600', 'dark:text-red-400',

    // --- NEW: Grid Column Class (Optional but safe) ---
    // Although fixing the dynamic class string is preferred, 
    // adding this ensures it works even if you revert that change.
    'grid-cols-4', 
  ],
  theme: {
    // ... rest of your theme config ...
    container: { // Make sure this section exists
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: { // Make sure this section exists
       // ... your color, borderRadius, keyframes, animation definitions ...
       colors: {
         border: "hsl(var(--border))",
         input: "hsl(var(--input))",
         ring: "hsl(var(--ring))",
         background: "hsl(var(--background))",
         foreground: "hsl(var(--foreground))",
         primary: {
           DEFAULT: "hsl(var(--primary))",
           foreground: "hsl(var(--primary-foreground))",
         },
         secondary: {
           DEFAULT: "hsl(var(--secondary))",
           foreground: "hsl(var(--secondary-foreground))",
         },
         destructive: {
           DEFAULT: "hsl(var(--destructive))",
           foreground: "hsl(var(--destructive-foreground))",
         },
         muted: {
           DEFAULT: "hsl(var(--muted))",
           foreground: "hsl(var(--muted-foreground))",
         },
         accent: {
           DEFAULT: "hsl(var(--accent))",
           foreground: "hsl(var(--accent-foreground))",
         },
         popover: {
           DEFAULT: "hsl(var(--popover))",
           foreground: "hsl(var(--popover-foreground))",
         },
         card: {
           DEFAULT: "hsl(var(--card))",
           foreground: "hsl(var(--card-foreground))",
         },
       },
       borderRadius: {
         lg: "var(--radius)",
         md: "calc(var(--radius) - 2px)",
         sm: "calc(var(--radius) - 4px)",
       },
       keyframes: {
         "accordion-down": {
           from: { height: "0" },
           to: { height: "var(--radix-accordion-content-height)" },
         },
         "accordion-up": {
           from: { height: "var(--radix-accordion-content-height)" },
           to: { height: "0" },
         },
       },
       animation: {
         "accordion-down": "accordion-down 0.2s ease-out",
         "accordion-up": "accordion-up 0.2s ease-out",
       },
    },
  },
  plugins: [require("tailwindcss-animate"),require('tailwind-scrollbar-hide')],
} satisfies Config

export default config
