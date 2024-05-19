# zkMNIST Game

zkMNIST is a proof of concept game that explores the possibility of running a
neural network inside a zero knowledge circuit. Game has the following rules:

The goal is to draw a number with the least amount of pixels activated that will be recognized by the model as some number.
You can prove that you have such an image without revealing what that image is, to do so you generate a zero-knowledge proof.
Later, the only thing you need to expose to is the proof, what digit it is and how many pixels are lit up.
The proof is ran through the verifier generated from the circuit and if it passes your score is added to the leader board.
Verifier without needing the used input image confirms all the calculations done by the model.
Each digit is like a category in speed-running leader board where the proof is like the twitch recording made to confirm that you actually did it.

## Generate a proof

To submit your entry into the game you need to generate a proof that you
actually have an image that has a better score than others. Follow the steps
below to install `noir` and prove your input with it.

- `curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash`
- `noirup`
- edit `Prover.toml` to include your image
- `nargo prove`

## Deploy the verifier to any evm compliant chain

Since the verifier compiles down to a Solidity contract you can deploy it on
any EVM compliant chain. To actually do it, follow these steps:

- `nargo codegen-verifier`
- `forge create --rpc-url='<url>' UltraVerifier`
