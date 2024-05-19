import { Link } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full h-screen sticky top-0">
			<div className="h-20 m-4 border border-main flex text-main rounded-lg justify-between items-center px-8 mb-8">
				<div className="text-2xl">zk<strong className="uppercase">Kocioł</strong></div>
				<div className="flex gap-0 text-xl font-semibold">
					<Link to="/" className="link">
						Draw
					</Link>
					<Link to="/verify" className="link">
						Verify
					</Link>
				</div>
			</div>
			<div className="px-4 h-full top-0">{children}</div>
		</div>
	);
}
