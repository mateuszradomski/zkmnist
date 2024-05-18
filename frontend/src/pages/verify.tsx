import { useEffect, useState } from "react";
import Button from "../components/Button";
import Textarea, { Input } from "../components/Textarea";
import { Noir } from "@noir-lang/noir_js";
import {
  BarretenbergBackend,
  CompiledCircuit,
} from "@noir-lang/backend_barretenberg";
import circuit from "../../../target/mnist.json";
import ConfettiExplosion from "react-confetti-explosion";
import explosionImg from "../../static/explosion.gif";
import { BaseEmoji } from "@oktupol/base-emoji";

function Verify() {
  const [proof, setProof] = useState("");
  const [noir, setNoir] = useState<Noir>();
  const [digit, setDigit] = useState("");
  const [isExploding, setIsExploding] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  useEffect(() => {
    // Load Noir
    const backend = new BarretenbergBackend(circuit as CompiledCircuit);
    const noir = new Noir(circuit as CompiledCircuit, backend);
    setNoir(noir);
  }, []);

  async function handleOffChainVerification() {
    if (!proof || !noir || !digit) return;

    const proofDecoded = BaseEmoji.decode(proof, {
      format: "string",
    }) as string;
    const proofAsByteArray = byteArrFromHexStr(proofDecoded);
    console.log("Verifying...");
    const result = await noir.verifyProof({
      publicInputs: [digitToHexString(+digit)],
      proof: proofAsByteArray,
    });
    console.log("Verification result: ", result);
    if (result) {
      setIsExploding(true);
      alert("Proof verified successfully!");
    } else {
      setIsBurning(true);
      setTimeout(() => {
        setIsBurning(false);
      }, 800);
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-top">
      <div className="w-[560px]">
        <h1 className="text-2xl mb-2 font-semibold">Verify proof</h1>

        <Input label="Digit" value={digit} setValue={setDigit} />
      </div>
      <div className="w-full h-3/5">
        <Textarea
          label="Proof"
          value={proof}
          setValue={setProof}
          className="w-full h-full text-sm"
        />
        <div className="flex w-full justify-end mt-4">
          <Button
            className="relative"
            type="button"
            onClick={() => handleOffChainVerification()}
          >
            Verify proof
            {isExploding && (
              <ConfettiExplosion
                particleCount={500}
                force={1}
                width={3000}
                onComplete={() => setIsExploding(false)}
              />
            )}
            {isBurning && (
              <div className="absolute flex -left-60 -top-32">
                <img src={explosionImg} className="w-48 h-48" alt="Explosion" />
                <img src={explosionImg} className="w-48 h-48" alt="Explosion" />
                <img src={explosionImg} className="w-48 h-48" alt="Explosion" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
function byteArrFromHexStr(hexString: string) {
  const str = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  if (str.length % 2 !== 0) throw new Error("Invalid hex string length");
  const arr = [];
  for (let i = 0; i < str.length; i += 2) {
    arr.push(parseInt(str.substring(i, i + 2), 16));
  }
  return new Uint8Array(arr);
}

function digitToHexString(digit: number) {
  return "0x" + digit.toString(16).padStart(64, "0");
}

export default Verify;
