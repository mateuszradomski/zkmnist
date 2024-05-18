import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import Button from "./Button";

export function MNISTDraw(props: {
	setProcessedImage: (data: number[]) => void;
}) {
	const fabricRef = useRef<fabric.Canvas>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const scaledCanvasRef = useRef<HTMLCanvasElement>(null);

	function resetFabric() {
		if (!fabricRef.current) return;
		fabricRef.current.clear();
	}

	useEffect(() => {
		const initFabric = () => {
			const canvas = new fabric.Canvas(canvasRef.current);
			canvas.setWidth(560);
			canvas.setHeight(560);

			canvas.isDrawingMode = true;
			canvas.freeDrawingBrush.width = 32;
			canvas.freeDrawingBrush.color = "#000000";
			canvas.backgroundColor = "#ffffff";
			canvas.renderAll();

			// @ts-ignore
			fabricRef.current = canvas;
		};

		const disposeFabric = () => {
			fabricRef.current?.dispose();
		};

		initFabric();

		return () => {
			disposeFabric();
		};
	}, []);

	function processImage(canvas: HTMLCanvasElement): number[] {
		// Convert on-screen image to something we can feed into our model.
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Could not get 2d context");
		const ctxScaled = scaledCanvasRef.current?.getContext("2d");
		if (!ctxScaled)
			throw new Error("Could not get 2d context for scaled canvas");

		ctxScaled.save();
		ctxScaled.clearRect(0, 0, ctxScaled.canvas.height, ctxScaled.canvas.width);
		ctxScaled.scale(28.0 / ctx.canvas.width, 28.0 / ctx.canvas.height);
		ctxScaled.drawImage(canvas, 0, 0);
		const { data } = ctxScaled.getImageData(0, 0, 28, 28);

		ctxScaled.restore();
		// Normalize the data
		const pixels = new Array(28 * 28);
		for (let i = 0; i < 28 * 28; i++) {
			const r = data[i * 4];
			const g = data[i * 4 + 1];
			const b = data[i * 4 + 2];
			// set 1 if the pixel is dark, 0 if it's light
			pixels[i] = 1 - (r + g + b) / 3 / 255;
		}
		return pixels;
	}

	return (
		<div>
			<canvas ref={canvasRef} className="h-[560px] w-[560px] border" />
			<canvas className="hidden" ref={scaledCanvasRef} />
			<div className="flex w-full justify-between mt-4">
				<Button
					type="button"
					onClick={() => {
						if (!canvasRef.current) return;
						props.setProcessedImage(processImage(canvasRef.current));
					}}
				>
					Process
				</Button>
				<Button
					type="reset"
					onClick={() => {
						resetFabric();
					}}
				>
					Reset grid
				</Button>
			</div>
		</div>
	);
}

export default MNISTDraw;
