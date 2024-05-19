import { Link } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full h-screen sticky top-0">
			<div className="h-20 shadow shadow-main flex text-main  justify-between w-screen items-center px-8 mb-8">
				<div className="text-2xl font-bold uppercase">Kocioł</div>
				<div className="flex gap-4 text-xl font-semibold">
					<Link to="/">Draw</Link>
					<Link to="/verify">Verify</Link>
				</div>
			</div>
			<div className="px-4 h-full top-0">{children}</div>
		</div>
	);
}
