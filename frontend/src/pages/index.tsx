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
	([exponent, mantissa, sign]) => ({ exponent, mantissa, sign }),
);
const weightsOutput = (w_output as [number, number, number][]).map(
	([exponent, mantissa, sign]) => ({ exponent, mantissa, sign }),
);

function MainPage() {
	const [processedImage, setProcessedImage] = useState<number[]>();
	const [proof, setProof] = useState(new Uint8Array());
	const [noir, setNoir] = useState<Noir>();
	const [digit, setDigit] = useState<number>();

	useEffect(() => {
		// Load Noir
		const backend = new BarretenbergBackend(circuit as CompiledCircuit);
		const noir = new Noir(circuit as CompiledCircuit, backend);
		setNoir(noir);
	}, []);

	// https://noir-lang.org/docs/tutorials/noirjs_app
	const handleGenerateProof = async () => {
		if (!noir) throw new Error("No noir instance");
		if (!processedImage) throw new Error("No processed image");
		if (digit === undefined) throw new Error("No digit");
		console.log("logs", "Generating proof... ⌛");

		const input = {
			img: processedImage,
			w_hidden: weightsHidden,
			w_output: weightsOutput,
			digit,
		};
		const proof = await noir.generateProof(input);
		console.log(proof, "Generating proof... ✅");
		setProof(proof.proof);
	};

	return (
		<div className="w-full flex flex-col gap-4 items-center justify-center">
			{/** Input digit */}
      <label htmlFor="digit" className="font-semibold text-lg">
        Digit:</label>
			<input
        className="border p-2"
				type="number"
				onChange={(e) => {
					const { value } = e.target;
					if (!value) return;
					setDigit(+value);
				}}
			/>
			<MNISTDraw setProcessedImage={setProcessedImage} />
      <Button type='submit' onClick={handleGenerateProof}>Generate Proof</Button>
			{proof && (
				<div className="mt-4 font-semibold text-lg">Proof: {proof}</div>
			)}
		</div>
	);
}

export default MainPage;
