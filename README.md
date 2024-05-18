# Install Nargo

`curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash`

# Run Noirup

`noirup`

# Do the thing

`nargo prove` and `nargo verify`

# Generate the verifier

`nargo codegen-verifier`

## Deploy

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Anvil

```shell
$ anvil
```

### Deploy
Make sure you have `anvil` running when deploying locally

```shell
$ forge script scripts/Deploy.s.sol --fork-url http://localhost:8545 --broadcast
```