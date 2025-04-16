export default function Footer() {
	return (
		// JSX needs a single root element
		<footer className="border-t py-6 md:py-0">
			{/* Footer */}
			<div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
				<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
					Laravel, PHP, MySQL &amp; JavaScript Cheatsheet - All the important concepts for your interview preparation
				</p>
				<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
					<span className="font-bold text-foreground">Thank You! Best of Luck! 🚀</span>
				</p>
			</div>
		</footer>
	);
}
