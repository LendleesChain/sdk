import { Command } from "commander";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

const program = new Command();

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const programId = new PublicKey("LeNdLeSs22222222222222222222222222222");
const idl = require("./idl/lendless.json");
const lendless = new anchor.Program(idl, programId, provider);

program
  .command("init")
  .description("Init user account")
  .action(async () => {
    const user = anchor.web3.Keypair.generate();
    await lendless.methods
      .initUser()
      .accounts({
        user: user.publicKey,
        owner: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();
    console.log("User initialized:", user.publicKey.toBase58());
  });

program
  .command("deposit <lamports>")
  .action(async (lamports) => {
    await lendless.methods
      .deposit(new anchor.BN(lamports))
      .accounts({
        user: USER_PUBKEY,
        owner: provider.wallet.publicKey,
        vault: VAULT_PDA,
      })
      .rpc();
    console.log("Deposited:", lamports);
  });

program
  .command("borrow <amount>")
  .action(async (amount) => {
    await lendless.methods
      .borrow(new anchor.BN(amount))
      .accounts({
        user: USER_PUBKEY,
        stableMint: STABLE_MINT,
        userToken: USER_TOKEN,
        mintAuthority: MINT_AUTH_PDA,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .rpc();
    console.log("Borrowed:", amount);
  });

program
  .command("repay <amount>")
  .action(async (amount) => {
    await lendless.methods
      .repay(new anchor.BN(amount))
      .accounts({
        user: USER_PUBKEY,
        stableMint: STABLE_MINT,
        userToken: USER_TOKEN,
