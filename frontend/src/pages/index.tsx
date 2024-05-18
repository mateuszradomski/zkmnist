import { useEffect, useState } from "react";
import MNISTDraw from "../components/MNISTDraw";
import {
  BarretenbergBackend,
  CompiledCircuit,
} from "@noir-lang/backend_barretenberg";
import circuit from "../../../target/mnist.json";
import w_hidden from "../../../weights/weights_hidden_float.json";
import w_output from "../../../weights/weights_output_float.json";
import { Noir } from "@noir-lang/noir_js";
import Button from "../components/Button";

const weightsHidden = (w_hidden as [number, number, number][]).map(
  ([sign, mantissa, exponent]) => ({
    exponent: 100 - exponent,
    mantissa,
    sign,
  })
);
const weightsOutput = (w_output as [number, number, number][]).map(
  ([sign, mantissa, exponent]) => ({
    exponent: 100 - exponent,
    mantissa,
    sign,
  })
);

import { compile, createFileManager } from "@noir-lang/noir_wasm";
import MNISTBoard from "../components/Grid";

export async function getCircuit() {
  const fm = createFileManager("/");
  const main = (await fetch(new URL(`../../static/main.nr`, import.meta.url)))
    .body as ReadableStream<Uint8Array>;
  const nargoToml = (
    await fetch(new URL(`../../static/Nargo.toml`, import.meta.url))
  ).body as ReadableStream<Uint8Array>;

  fm.writeFile("./src/main.nr", main);
  fm.writeFile("./Nargo.toml", nargoToml);
  const result = await compile(fm);
  if (!("program" in result)) {
    throw new Error("Compilation failed");
  }
  return result.program as CompiledCircuit;
}

const SIZE = 28;

function MainPage() {
  const emptyGrid = Array(SIZE)
		.fill(null)
		.map(() => Array(SIZE).fill(0)) as number[][];

  const [processedImage, setProcessedImage] = useState<number[]>();
  const [proof, setProof] = useState(new Uint8Array());
  const [noir, setNoir] = useState<Noir>();
  const [digit, setDigit] = useState<number>();
  const [grid, setGrid] = useState<number[][]>(emptyGrid);

  useEffect(() => {
    // convert grid to processedImage
    const processedImage = grid.flat();
    setProcessedImage(processedImage);
  }, [grid])

  useEffect(() => {
    // Load Noir
    const backend = new BarretenbergBackend(circuit as CompiledCircuit);
    const noir = new Noir(circuit as CompiledCircuit, backend);
    setNoir(noir);
  }, []);

  const resetGrid = () => {
		setGrid(emptyGrid);
	};

  // https://noir-lang.org/docs/tutorials/noirjs_app
  const handleGenerateProof = async () => {
    if (!noir) throw new Error("Noir not initialized");
    if (!processedImage) throw new Error("No image to process");
    if (!digit) throw new Error("No digit to process");

    await noir.init();

    const input = {
      img: processedImage,
      w_hidden: weightsHidden,
      w_output: weightsOutput,
      digit,
    };
    console.log(input);
    console.log("here1");
    const proof = await noir.generateProof(input);
    console.log("here2");
    console.log(proof, "Generating proof... ✅");
    setProof(proof.proof);
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      {/** Input digit */}
      <div className="flex flex-col items-center">
      <MNISTBoard grid={grid} setGrid={setGrid} />
      <div className="flex w-full justify-between mt-4">
      <Button
					type="button"
					onClick={() => {
            if (!processedImage) return;
						navigator.clipboard.writeText(`[${processedImage.join(",")}]`);
            alert("Copied image to clipboard");
					}}
				>
					Copy image
				</Button>
					<Button type="button" onClick={resetGrid}>
						Reset grid
					</Button>
				</div>
        </div>
      {/* <MNISTDraw setProcessedImage={setProcessedImage} /> */}
      {/* <Button type="submit" onClick={handleGenerateProof}>
				Generate Proof
			</Button>
			{proof && (
				<div className="mt-4 font-semibold text-lg">Proof: {proof}</div>
			)} */}
    </div>
  );
}

export default MainPage;
