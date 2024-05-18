import { useState } from "react";
import Button from "../components/Button";
import MNISTBoard from "../components/MNISTDraw";

const SIZE = 28;

function MainPage() {
	const emptyGrid = Array(SIZE)
		.fill(null)
		.map(() => Array(SIZE).fill(0));
	const [grid, setGrid] = useState(emptyGrid);

	const resetGrid = () => {
		setGrid(emptyGrid);
	};

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
			</div>
		</div>
	);
}

export default MainPage;
