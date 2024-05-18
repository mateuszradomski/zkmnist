import { memo, useCallback, useState } from "react";
import cn from "../utils/cn";

const SIZE = 28;

interface MNISTBoardProps {
	grid: number[][];
	setGrid: (grid: number[][]) => void;
}

export default function MNISTBoard({ grid, setGrid }: MNISTBoardProps) {
	const [mouseDown, setMouseDown] = useState(false);

	const handleDraw = useCallback(
		(x: number, y: number) => {
			if (!mouseDown) return;
			const newArray = [];
			for (let i = 0; i < grid.length; i++) newArray[i] = grid[i].slice();
			newArray[x][y] = grid[x][y] === 0 ? 1 : 0;
			setGrid(newArray);
		},
		[mouseDown, grid, setGrid],
	);

	return (
		<div
			className="w-[560px] h-[560px]"
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
				gridTemplateRows: `repeat(${SIZE}, 1fr)`,
				gap: 0,
			}}
			onMouseDown={() => setMouseDown(true)}
			onMouseUp={() => setMouseDown(false)}
		>
			{grid.map((r, a) =>
				r.map((c, i) => (
					<Cell
						key={`element-${a}-${i}`}
						x={a}
						y={i}
						handleDraw={handleDraw}
						value={c}
					/>
				)),
			)}
		</div>
	);
}

interface CellProps {
	x: number;
	y: number;
	value: number;
	handleDraw: (x: number, y: number) => void;
}

const Cell: React.FC<CellProps> = memo(({ x, y, value, handleDraw }) => {
	return (
		<div
			className={cn(
				"w-[20px] h-[20px] border border-black",
				value === 1 ? "bg-black" : "bg-white",
			)}
			onMouseEnter={() => handleDraw(x, y)}
		/>
	);
});
