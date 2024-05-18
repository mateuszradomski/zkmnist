import { Link } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full sticky top-0">
			<div className="h-20 shadow-lg flex justify-between w-screen items-center px-8 mb-8">
				<div className="text-2xl font-bold uppercase">Kocioł</div>
				<div className="flex gap-2 text-lg">
					<Link to="/">Draw</Link>
					<Link to="/verify">Verify</Link>
				</div>
			</div>
			<div className="px-4">{children}</div>
		</div>
	);
}
