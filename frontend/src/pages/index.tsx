import { useState } from "react";
import Button from "../components/Button";
import MNISTBoard from "../components/MNISTDraw";
import { noir } from "../utils/noir";

const SIZE = 28;

function MainPage() {
	const emptyGrid = Array(SIZE)
		.fill(null)
		.map(() => Array(SIZE).fill(0)) as number[][];
	const [grid, setGrid] = useState(emptyGrid);
	const [proof, setProof] = useState<Uint8Array>();

	const resetGrid = () => {
		setGrid(emptyGrid);
	};

	// const handleGenerateProof = async () => {
	// 	if (!noir) throw new Error("No noir instance");
	// 	console.log("logs", "Generating proof... ⌛");
	// 	const proof = await noir.generateProof({ grid });
	// 	console.log("logs", "Generating proof... ✅");
	// 	setProof(proof.proof);
	// };

	return (
		<div className="w-full flex flex-col gap-4 items-center justify-center">
			<div className="w-[560px]">
				<h1 className="text-2xl mb-2 font-semibold">Draw number</h1>
				<MNISTBoard grid={grid} setGrid={setGrid} />
				<div className="flex w-full justify-between mt-4">
					<Button type="button" onClick={resetGrid}>
						Generate proof
					</Button>
					<Button type="button" onClick={resetGrid}>
						Reset grid
					</Button>
				</div>
				{proof && (
					<div className="mt-4 font-semibold text-lg">Proof: {proof}</div>
				)}
			</div>
		</div>
	);
}

export default MainPage;
