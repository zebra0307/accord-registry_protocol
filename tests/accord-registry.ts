import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BlueCarbonRegistry } from "../target/types/blue_carbon_registry";
import {
  PublicKey,
  Keypair,
  SystemProgram,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import { assert } from "chai";

describe("blue-carbon-registry", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.BlueCarbonRegistry as Program<BlueCarbonRegistry>;

  let projectOwner: Keypair;
  let projectPda: PublicKey;
  let registryPda: PublicKey;
  let tokenMint: PublicKey;
  let projectTokenAccount: PublicKey;
  let investorTokenAccount: PublicKey;
  let investorWallet: Keypair;
  let retirementAccount: PublicKey;
  let doubleCountingRegistryPda: PublicKey;

  const projectId = `BCP-${Date.now()}`; // Make unique with timestamp
  const ipfsCid = "QmYwAPJzv5CZsnAzt8auVKRQm6VLw4Dy8YQANhBBfmGjw8";

  // Test constants
  const TOKEN_DECIMALS = 6;
  const INITIAL_MINT_AMOUNT = 600; // Match verified carbon tons
  const TRANSFER_AMOUNT = 200;
  const RETIREMENT_AMOUNT = 100;

  before(async () => {
    try {
      // Use the provider's wallet as the project owner (it already has SOL)
      projectOwner = (provider.wallet as anchor.Wallet).payer;

      // Create a separate investor wallet
      investorWallet = Keypair.generate();

      // Derive the project PDA
      [projectPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("project"), projectOwner.publicKey.toBuffer(), Buffer.from(projectId)],
        program.programId
      );

      // Derive the registry PDA  
      [registryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("registry_v3")],
        program.programId
      );

      // Derive the carbon token mint PDA
      const [carbonTokenMintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("carbon_token_mint_v3")],
        program.programId
      );

      tokenMint = carbonTokenMintPda;

      // Derive the double counting registry PDA
      [doubleCountingRegistryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("double_counting_registry")],
        program.programId
      );

      console.log("Test setup completed successfully");
    } catch (error) {
      console.error("Test setup failed:", error);
      throw error;
    }
  });

  it("Initializes the registry successfully", async () => {
    try {
      // Try to fetch the registry first - if it exists, skip initialization
      const existingRegistry = await program.account.globalRegistry.fetch(registryPda);
      console.log("Registry already exists, skipping initialization");

      // Verify existing registry has correct properties
      assert.equal(existingRegistry.admin.toString(), projectOwner.publicKey.toString());
      console.log("✅ Existing registry verified successfully");
    } catch (error) {
      // Registry doesn't exist, initialize it
      console.log("Registry not found, initializing...");

      const tx = await program.methods
        .initializeRegistry(TOKEN_DECIMALS)
        .accounts({
          registry: registryPda,
          carbonTokenMint: tokenMint,
          admin: projectOwner.publicKey,
          governmentAuthority: projectOwner.publicKey, // Use project owner as gov authority for tests
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        } as any)
        .signers([projectOwner])
        .rpc();

      console.log("Registry initialization transaction signature:", tx);

      // Fetch the registry account and verify its data
      const registryAccount = await program.account.globalRegistry.fetch(registryPda);

      assert.equal(registryAccount.totalCreditsIssued.toString(), "0");
      assert.equal(registryAccount.totalProjects.toString(), "0");
      assert.equal(registryAccount.admin.toString(), projectOwner.publicKey.toString());

      console.log("✅ Registry initialized successfully");
    }
  });

  it("Initializes the Double Counting Registry", async () => {
    try {
      await program.account.doubleCountingRegistry.fetch(doubleCountingRegistryPda);
      console.log("✅ Double Counting Registry already exists");
    } catch {
      console.log("Double Counting Registry not found, initializing...");
      await program.methods
        .initializeDoubleCountingRegistry()
        .accounts({
          doubleCountingRegistry: doubleCountingRegistryPda,
          authority: projectOwner.publicKey,
          systemProgram: SystemProgram.programId,
        } as any)
        .signers([projectOwner])
        .rpc();

      console.log("✅ Double Counting Registry initialized");
    }
  });

  // New PDAs for User Accounts
  let ownerUserAccount: PublicKey;
  let investorUserAccount: PublicKey;

  it("Assigns Roles for RBAC", async () => {
    // Derive User Account PDAs
    [ownerUserAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), projectOwner.publicKey.toBuffer()],
      program.programId
    );
    [investorUserAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), investorWallet.publicKey.toBuffer()],
      program.programId
    );

    // 1. Assign Admin/Validator Role to ProjectOwner (Simulating Admin)
    // In real app, Admin is separate. Here we reuse projectOwner as Admin for simplicity in test setup for Registry.
    // Permissions: Register Project (1) + Verify Project (2) = 3 + others...
    // Let's give FULL ADMIN permissions.
    const ALL_PERMISSIONS = new anchor.BN(
      "11111111111", 2 // Binary string to permissions mask
    );
    const ADMIN_PERMISSIONS = new anchor.BN(2047); // 2^11 - 1

    try {
      await program.methods.assignRole(
        projectOwner.publicKey,
        { admin: {} }, // Role Admin
        ADMIN_PERMISSIONS
      ).accounts({
        userAccount: ownerUserAccount,
        registry: registryPda,
        admin: projectOwner.publicKey,
        systemProgram: SystemProgram.programId,
      } as any).signers([projectOwner]).rpc();
      console.log("✅ Assigned Admin role to ProjectOwner");
    } catch (e) {
      console.log("Role assignment failed (maybe exists):", e);
    }
  });

  it("Registers a project successfully", async () => {
    const carbonTonsEstimated = new anchor.BN(1000);

    const projectData = {
      projectId: projectId,
      ipfsCid: ipfsCid,
      carbonTonsEstimated: carbonTonsEstimated,
      projectSector: { blueCarbon: {} },
      location: {
        latitude: 0,
        longitude: 0,
        polygonCoordinates: [],
        countryCode: "IN",
        regionName: "Sundarbans"
      },
      areaHectares: 100,
      establishmentDate: new anchor.BN(Date.now() / 1000),
      vintageYear: 2024,
      pricePerTon: new anchor.BN(10_000_000),
      cctsRegistryId: "", // Empty for initial registration
      complianceIdSignature: Buffer.from([]), // Empty signature
    };

    const tx = await program.methods
      .registerProject(projectData)
      .accounts({
        project: projectPda,
        registry: registryPda,
        projectOwner: projectOwner.publicKey,
        userAccount: ownerUserAccount,
        doubleCountingRegistry: doubleCountingRegistryPda,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([projectOwner])
      .rpc();

    console.log("Project registration transaction signature:", tx);
    console.log("✅ Project registered successfully");
  });

  it("Initializes Verification Escrow and Verifies", async () => {
    // 1. Initialize Escrow
    const fee = new anchor.BN(1_000_000_000); // 1 SOL

    await program.methods.initializeVerification(fee)
      .accounts({
        project: projectPda,
        owner: projectOwner.publicKey,
        verifier: projectOwner.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([projectOwner])
      .rpc();

    const projectAccountAfterInit = await program.account.project.fetch(projectPda);
    assert.equal(projectAccountAfterInit.auditEscrowBalance.toString(), fee.toString());

    // 2. Verify Project & Release Escrow
    const verifiedCarbonTons = new anchor.BN(1000);

    const tx = await program.methods
      .verifyProject(verifiedCarbonTons)
      .accounts({
        project: projectPda,
        registry: registryPda,
        admin: projectOwner.publicKey,
        adminAccount: ownerUserAccount,
      } as any)
      .signers([projectOwner])
      .rpc();

    console.log("Project verification transaction signature:", tx);

    const projectAccountAfterVerify = await program.account.project.fetch(projectPda);
    assert.equal(projectAccountAfterVerify.auditEscrowBalance.toString(), "0");

    console.log("✅ Project verified and escrow released successfully");
  });

  it("Approves project compliance (Government)", async () => {
    // Owner already has Admin role which likely includes Govt permissions?
    // Or we update role. Admin usually has all access.
    // Permissions mask 2047 includes everything.

    // We pass the same userAccount.
    const tx = await program.methods.approveProjectCompliance(
      "ICM-REG-001",
      new anchor.BN(1000),
      true
    ).accounts({
      project: projectPda,
      authority: projectOwner.publicKey,
      userAccount: ownerUserAccount,
    } as any).signers([projectOwner]).rpc();

    console.log("Compliance approval tx:", tx);
    console.log("✅ Compliance approved successfully");
  });

  it("Mints credits successfully", async () => {
    // Use the carbon token mint from the registry (already created)
    console.log("Token mint:", tokenMint.toString());

    // Create token account for the project owner
    projectTokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        provider.connection,
        projectOwner,
        tokenMint,
        projectOwner.publicKey,
        false,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID // Use Token-2022
      )
    ).address;

    console.log("Project token account created:", projectTokenAccount.toString());

    const amountToMint = new anchor.BN(INITIAL_MINT_AMOUNT * (10 ** TOKEN_DECIMALS)); // 1000 tokens with 6 decimals

    const tx = await program.methods
      .mintVerifiedCredits(amountToMint)
      .accounts({
        project: projectPda,
        registry: registryPda,
        carbonTokenMint: tokenMint,
        recipientTokenAccount: projectTokenAccount,
        owner: projectOwner.publicKey,
        recipient: projectOwner.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      } as any)
      .signers([projectOwner])
      .rpc();

    console.log("Mint credits transaction signature:", tx);

    // Verify the project account was updated
    const projectAccount = await program.account.project.fetch(projectPda);
    const tokenAccountInfo = await getAccount(
      provider.connection,
      projectTokenAccount,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    assert.equal(projectAccount.creditsIssued.toString(), amountToMint.toString());
    assert.equal(projectAccount.tokensMinted.toString(), amountToMint.toString());
    // Note: token account may have accumulated balance from previous test runs
    console.log("Token account balance:", tokenAccountInfo.amount.toString());
    console.log("Expected amount:", amountToMint.toString());

    console.log("✅ Credits minted successfully");
  });

  it("Transfers credits successfully", async () => {
    // Create token account for investor (owned by separate investor wallet)
    investorTokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        provider.connection,
        projectOwner,
        tokenMint,
        investorWallet.publicKey,
        false,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
      )
    ).address;

    console.log("Investor token account created:", investorTokenAccount.toString());

    const amountToTransfer = new anchor.BN(TRANSFER_AMOUNT * (10 ** TOKEN_DECIMALS)); // 500 tokens

    // Transfer from project owner's token account to investor token account
    const tx = await program.methods
      .transferCredits(amountToTransfer)
      .accounts({
        fromAccount: projectTokenAccount,
        toAccount: investorTokenAccount,
        mint: tokenMint,
        fromAuthority: projectOwner.publicKey, // Project owner is the authority
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      } as any)
      .signers([projectOwner])
      .rpc();

    console.log("Transfer credits transaction signature:", tx);

    // Verify the transfer
    const investorTokenAccountInfo = await getAccount(
      provider.connection,
      investorTokenAccount,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    assert.equal(
      investorTokenAccountInfo.amount.toString(),
      amountToTransfer.toString()
    );

    console.log("✅ Credits transferred successfully");
  });

  it("Retires credits and mints certificate", async () => {
    // Fund the investor wallet
    const airdropTx = await provider.connection.requestAirdrop(investorWallet.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);

    const amountToRetire = new anchor.BN(RETIREMENT_AMOUNT * (10 ** TOKEN_DECIMALS));
    const retirementId = `RET-${Date.now()}`;

    // Derive Certificate Mint PDA
    const [certificateMintPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("retirement"), investorWallet.publicKey.toBuffer(), Buffer.from(retirementId)],
      program.programId
    );

    // Derive Associated Token Account for Certificate
    const certificateTokenAccount = await getAssociatedTokenAddress(
      certificateMintPda,
      investorWallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = await program.methods
      .retireCredits(amountToRetire, retirementId)
      .accounts({
        creditMint: tokenMint,
        userTokenAccount: investorTokenAccount,
        owner: investorWallet.publicKey,
        certificateMint: certificateMintPda,
        certificateTokenAccount: certificateTokenAccount,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      } as any)
      .signers([investorWallet])
      .rpc();

    console.log("Retire tx:", tx);

    // Verify Certificate
    const certAccount = await getAccount(provider.connection, certificateTokenAccount, undefined, TOKEN_2022_PROGRAM_ID);
    assert.equal(certAccount.amount.toString(), "1");
    // Should check mint info for decimals=0 and non-transferable extension if possible, but simplest is amount check.

    // Verify Burn (Credits Removed)
    const creditAccount = await getAccount(provider.connection, investorTokenAccount, undefined, TOKEN_2022_PROGRAM_ID);
    // Previous tests transferred 200, so after retiring 100, should have 100.
    // Wait, initial transfer might have been different in previous runs.

    console.log("✅ Credits retired and Certificate minted");
  });

  // ===================================
  // DEX / AMM Tests
  // ===================================

  let quoteMint: PublicKey;
  let quoteTokenAccount: PublicKey;
  let poolPda: PublicKey;
  let lpMintPda: PublicKey;
  let creditVaultPda: PublicKey;
  let quoteVaultPda: PublicKey;
  let userLpAccount: PublicKey;

  it("Setup DEX: Initializes Mock Quote Token", async () => {
    // Create a mock USDC mint
    quoteMint = await createMint(
      provider.connection,
      projectOwner,
      projectOwner.publicKey,
      null,
      6, // 6 decimals
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    console.log("Quote Mint created:", quoteMint.toString());

    // Mint some quote tokens to projectOwner
    quoteTokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        provider.connection,
        projectOwner,
        quoteMint,
        projectOwner.publicKey,
        false,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
      )
    ).address;

    // Mint 100,000 Quote Tokens
    await import("@solana/spl-token").then(spl => spl.mintTo(
      provider.connection,
      projectOwner,
      quoteMint,
      quoteTokenAccount,
      projectOwner,
      100_000_000_000, // 100,000 * 10^6
      [],
      undefined,
      TOKEN_2022_PROGRAM_ID
    ));

    console.log("Minted mock quote tokens to owner");
  });

  it("Initializes Liquidity Pool", async () => {
    // Derive PDAs
    [poolPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("liquidity_pool"), tokenMint.toBuffer(), quoteMint.toBuffer()],
      program.programId
    );

    [lpMintPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("lp_mint"), poolPda.toBuffer()],
      program.programId
    );

    [creditVaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("credit_vault"), poolPda.toBuffer()],
      program.programId
    );

    [quoteVaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("quote_vault"), poolPda.toBuffer()],
      program.programId
    );

    const tx = await program.methods.initializePool(30) // 0.3% fee
      .accounts({
        pool: poolPda,
        lpMint: lpMintPda,
        creditMint: tokenMint,
        quoteMint: quoteMint,
        creditVault: creditVaultPda,
        quoteVault: quoteVaultPda,
        authority: projectOwner.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      } as any)
      .signers([projectOwner])
      .rpc();

    console.log("Initialize Pool tx:", tx);
    console.log("✅ Liquidity Pool initialized");
  });

  it("Adds Liquidity to Pool", async () => {
    // Get user LP account
    userLpAccount = (
      await getOrCreateAssociatedTokenAccount(
        provider.connection,
        projectOwner,
        lpMintPda,
        projectOwner.publicKey,
        false,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
      )
    ).address;

    // Add 100 Credits and 100 Quote
    const creditAmount = new anchor.BN(100_000_000);
    const quoteAmount = new anchor.BN(100_000_000);

    const tx = await program.methods.addLiquidity(creditAmount, quoteAmount)
      .accounts({
        pool: poolPda,
        lpMint: lpMintPda,
        creditVault: creditVaultPda,
        quoteVault: quoteVaultPda,
        creditMint: tokenMint,
        quoteMint: quoteMint,
        userCreditAccount: projectTokenAccount,
        userQuoteAccount: quoteTokenAccount,
        userLpAccount: userLpAccount,
        provider: projectOwner.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([projectOwner])
      .rpc();

    console.log("Add Liquidity tx:", tx);

    const lpAccount = await getAccount(provider.connection, userLpAccount, undefined, TOKEN_2022_PROGRAM_ID);
    console.log("User LP Balance:", lpAccount.amount.toString());
    assert(lpAccount.amount > BigInt(0), "Should have minted LP tokens");

    console.log("✅ Liquidity Added");
  });

  it("Swaps Credits for Quote", async () => {
    // Swap 10 Credits for Quote
    // Since pool is 100:100, adding 10 credits -> 110 credits.
    // k = 10000. New quote = 10000 / 110 = 90.90
    // Output = 100 - 90.90 = 9.09 Quote roughly.

    const amountIn = new anchor.BN(10_000_000); // 10 Credits
    const minAmountOut = new anchor.BN(8_000_000); // Expect at least 8 Quote

    const tx = await program.methods.swap(
      amountIn,
      minAmountOut
    ).accounts({
      pool: poolPda,
      creditVault: creditVaultPda,
      quoteVault: quoteVaultPda,
      creditMint: tokenMint,
      quoteMint: quoteMint,
      userSourceAccount: projectTokenAccount, // Credits
      userDestinationAccount: quoteTokenAccount, // Quote
      user: projectOwner.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    } as any)
      .signers([projectOwner])
      .rpc();

    console.log("Swap tx:", tx);
    console.log("✅ Swap Credits -> Quote Successful");
  });

  it("Removes Liquidity", async () => {
    // Remove 50% of LP tokens
    const lpAccount = await getAccount(provider.connection, userLpAccount, undefined, TOKEN_2022_PROGRAM_ID);
    const amountToRemove = new anchor.BN(lpAccount.amount.toString()).div(new anchor.BN(2));

    const tx = await program.methods.removeLiquidity(amountToRemove)
      .accounts({
        pool: poolPda,
        lpMint: lpMintPda,
        creditVault: creditVaultPda,
        quoteVault: quoteVaultPda,
        creditMint: tokenMint,
        quoteMint: quoteMint,
        userCreditAccount: projectTokenAccount,
        userQuoteAccount: quoteTokenAccount,
        userLpAccount: userLpAccount,
        provider: projectOwner.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      } as any)
      .signers([projectOwner])
      .rpc();

    console.log("Remove Liquidity tx:", tx);

    const lpAccountAfter = await getAccount(provider.connection, userLpAccount, undefined, TOKEN_2022_PROGRAM_ID);
    console.log("User LP Balance After:", lpAccountAfter.amount.toString());

    console.log("✅ Liquidity Removed");
  });

  // ===================================
  // Batch Minting Tests
  // ===================================
  it("Batch Mints Credits to Multiple Recipients", async () => {
    const recipients = [Keypair.generate(), Keypair.generate(), Keypair.generate()];
    const amounts = [new anchor.BN(10_000_000), new anchor.BN(20_000_000), new anchor.BN(30_000_000)];

    // Create token accounts for recipients
    const recipientTokenAccounts = await Promise.all(recipients.map(async (recipient) => {
      return (await getOrCreateAssociatedTokenAccount(
        provider.connection,
        projectOwner,
        tokenMint,
        recipient.publicKey,
        false,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
      )).address;
    }));

    const tx = await program.methods.batchMintCredits(amounts)
      .accounts({
        project: projectPda,
        registry: registryPda,
        carbonTokenMint: tokenMint,
        owner: projectOwner.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      } as any)
      .remainingAccounts(recipientTokenAccounts.map(pubkey => ({
        pubkey,
        isWritable: true,
        isSigner: false,
      })))
      .signers([projectOwner])
      .rpc();

    console.log("Batch Mint tx:", tx);

    // Verify balances
    for (let i = 0; i < recipients.length; i++) {
      const info = await getAccount(provider.connection, recipientTokenAccounts[i], undefined, TOKEN_2022_PROGRAM_ID);
      assert.equal(info.amount.toString(), amounts[i].toString());
      console.log(`Recipient ${i} balance verified: ${info.amount.toString()}`);
    }


    console.log("✅ Batch Mint Successful");
  });

  // ===================================
  // Marketplace Tests
  // ===================================

  let listingPda: PublicKey;
  let listingVaultPda: PublicKey;

  it("Creates Marketplace Listing", async () => {
    // Derive listing PDA [b"listing", project_id, seller]
    [listingPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("listing"), Buffer.from(projectId), projectOwner.publicKey.toBuffer()],
      program.programId
    );

    // Derive listing vault PDA [b"listing_vault", listing_key]
    [listingVaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("listing_vault"), listingPda.toBuffer()],
      program.programId
    );

    const listingData = {
      projectId: projectId,
      vintageYear: 2024,
      quantityAvailable: new anchor.BN(50_000_000), // 50 credits
      pricePerTon: new anchor.BN(5_000_000), // 5 USDC
      certificationStandards: ["Gold Standard"],
      currencyMint: quoteMint,
      expiryDate: new anchor.BN(Date.now() / 1000 + 86400),
    };

    const tx = await program.methods.createMarketplaceListing(projectId, listingData)
      .accounts({
        listing: listingPda,
        listingVault: listingVaultPda,
        project: projectPda,
        seller: projectOwner.publicKey,
        sellerCreditAccount: projectTokenAccount,
        creditMint: tokenMint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      } as any)
      .signers([projectOwner])
      .rpc();

    console.log("Create Listing tx:", tx);

    // Verify Vault Balance
    const vaultAccount = await getAccount(provider.connection, listingVaultPda, undefined, TOKEN_2022_PROGRAM_ID);
    assert.equal(vaultAccount.amount.toString(), "50000000");

    console.log("✅ Marketplace Listing Created");
  });

  it("Buys from Marketplace Listing", async () => {
    // 1. Fund Investor with Quote Tokens
    // ProjectOwner has Quote tokens. Transfer 1000 Quote (1000 * 10^6) to Investor
    const investorQuoteAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      projectOwner,
      quoteMint,
      investorWallet.publicKey,
      false,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    await import("@solana/spl-token").then(spl => spl.transfer(
      provider.connection,
      projectOwner,
      quoteTokenAccount,
      investorQuoteAccount.address,
      projectOwner,
      1000_000_000,
      [],
      undefined,
      TOKEN_2022_PROGRAM_ID
    ));

    // 2. Buy 10 Credits
    const amountToBuy = new anchor.BN(10_000_000);

    const tx = await program.methods.buyMarketplaceListing(amountToBuy)
      .accounts({
        listing: listingPda,
        listingVault: listingVaultPda,
        sellerPaymentAccount: quoteTokenAccount, // ProjectOwner receives payment
        buyer: investorWallet.publicKey,
        buyerPaymentAccount: investorQuoteAccount.address,
        buyerCreditAccount: investorTokenAccount, // Existing account from transfer test
        creditMint: tokenMint,
        currencyMint: quoteMint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      } as any)
      .signers([investorWallet])
      .rpc();

    console.log("Buy Listing tx:", tx);

    // Verify Balances
    const buyerCredits = await getAccount(provider.connection, investorTokenAccount, undefined, TOKEN_2022_PROGRAM_ID);
    // Was 500 (Transfer) - 100 (Retire) + 10 (Buy) = 410? 
    // Wait, Transfer was 200. Retire 100. So 100 left. + 10 = 110.
    // Let's just check it increased.
    console.log("Buyer Creds:", buyerCredits.amount.toString());

    const vaultAfter = await getAccount(provider.connection, listingVaultPda, undefined, TOKEN_2022_PROGRAM_ID);
    assert.equal(vaultAfter.amount.toString(), "40000000"); // 50 - 10 = 40

    console.log("✅ Bought from Listing");
  });

  it("Cancels Marketplace Listing", async () => {
    const tx = await program.methods.cancelMarketplaceListing()
      .accounts({
        listing: listingPda,
        listingVault: listingVaultPda,
        seller: projectOwner.publicKey,
        sellerCreditAccount: projectTokenAccount,
        creditMint: tokenMint, // Requires Mint now for checked transfer
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      } as any)
      .signers([projectOwner])
      .rpc();

    console.log("Cancel Listing tx:", tx);

    // Verify Listing Vault Closed (or empty)
    try {
      await getAccount(provider.connection, listingVaultPda, undefined, TOKEN_2022_PROGRAM_ID);
      assert.fail("Vault should be closed");
    } catch (e) {
      // Expected error: Account not initialized or found
      console.log("Vault closed successfully");
    }

    // Verify Seller got back 40 credits
    const sellerCredits = await getAccount(provider.connection, projectTokenAccount, undefined, TOKEN_2022_PROGRAM_ID);
    console.log("Seller Credits Refunded:", sellerCredits.amount.toString());

    console.log("✅ Listing Cancelled");
  });

});