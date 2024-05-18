import { useState } from "react";
import MNISTDraw from "../components/MNISTDraw";

function MainPage() {
	const [processedImage, setProcessedImage] = useState(new Uint8Array(28 * 28));
	const [proof, setProof] = useState(null);

	// https://noir-lang.org/docs/tutorials/noirjs_app
	// const handleGenerateProof = async () => {
	// 	if (!noir) throw new Error("No noir instance");
	// 	console.log("logs", "Generating proof... ⌛");
	// 	const proof = await noir.generateProof({ grid });
	// 	console.log("logs", "Generating proof... ✅");
	// 	setProof(proof.proof);
	// };

	return (
		<div className="w-full flex flex-col gap-4 items-center justify-center">
			<MNISTDraw setProcessedImage={setProcessedImage}/>
			{proof && (
				<div className="mt-4 font-semibold text-lg">Proof: {proof}</div>
			)}
		</div>
	);
}

export default MainPage;
