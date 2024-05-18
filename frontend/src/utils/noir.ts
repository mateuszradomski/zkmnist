import {
	BarretenbergBackend,
	BarretenbergVerifier,
} from "@noir-lang/backend_barretenberg";

// import circuit from "./circuit.json";

import { Noir } from "@noir-lang/noir_js";

let noir: Noir | undefined;
let backend: BarretenbergBackend | undefined;

try {
	backend = new BarretenbergBackend(circuit);
	noir = new Noir(circuit, backend);
} catch (e) {
	throw new Error(`Failed to initialize Noir: ${e}`);
}

export { noir, backend };
