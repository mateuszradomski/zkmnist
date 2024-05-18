import { useState } from "react";
import Button from "../components/Button";
import Textarea from "../components/Textarea";

function Verify() {
	const [proof, setProof] = useState<string>("");

	return (
		<div className="w-full flex flex-col gap-4 items-center justify-center">
			<div className="w-[560px]">
				<h1 className="text-2xl mb-2 font-semibold">Verify proof</h1>
				<Textarea value={proof} setValue={setProof} />
				<div className="flex w-full justify-end mt-4">
					<Button type="button">Verify proof</Button>
				</div>
			</div>
		</div>
	);
}

export default Verify;
