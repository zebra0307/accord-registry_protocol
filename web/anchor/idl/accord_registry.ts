/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/blue_carbon_registry.json`.
 */
export type BlueCarbonRegistry = {
  "address": "9W1Zh89ykeWSbXVTgHHgeUcyUTGSs2XAbMRvY1uR1gU",
  "metadata": {
    "name": "blueCarbonRegistry",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addLiquidity",
      "discriminator": [
        181,
        157,
        89,
        67,
        143,
        182,
        52,
        72
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.credit_mint",
                "account": "liquidityPool"
              },
              {
                "kind": "account",
                "path": "pool.quote_mint",
                "account": "liquidityPool"
              }
            ]
          }
        },
        {
          "name": "lpMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "creditVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "quoteVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  113,
                  117,
                  111,
                  116,
                  101,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "creditMint"
        },
        {
          "name": "quoteMint"
        },
        {
          "name": "userCreditAccount",
          "writable": true
        },
        {
          "name": "userQuoteAccount",
          "writable": true
        },
        {
          "name": "userLpAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "provider"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "lpMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "provider",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "creditAmount",
          "type": "u64"
        },
        {
          "name": "quoteAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "approveProjectCompliance",
      "docs": [
        "Government Compliance Approval (Article 6 / CCTS)"
      ],
      "discriminator": [
        144,
        159,
        122,
        151,
        16,
        146,
        182,
        236
      ],
      "accounts": [
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project.owner",
                "account": "project"
              },
              {
                "kind": "account",
                "path": "project.project_id",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "cctsRegistryId",
          "type": "string"
        },
        {
          "name": "authorizedExportLimit",
          "type": "u64"
        },
        {
          "name": "loaIssued",
          "type": "bool"
        }
      ]
    },
    {
      "name": "approveProposal",
      "docs": [
        "Approve a proposal"
      ],
      "discriminator": [
        136,
        108,
        102,
        85,
        98,
        114,
        7,
        147
      ],
      "accounts": [
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "proposal.proposal_id",
                "account": "adminProposal"
              }
            ]
          }
        },
        {
          "name": "multisigConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "approverAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "approver"
              }
            ]
          }
        },
        {
          "name": "approver",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "assignRole",
      "docs": [
        "Assign a role to a user"
      ],
      "discriminator": [
        255,
        174,
        125,
        180,
        203,
        155,
        202,
        131
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "userAddress"
              }
            ]
          }
        },
        {
          "name": "registry",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "userAddress",
          "type": "pubkey"
        },
        {
          "name": "role",
          "type": {
            "defined": {
              "name": "userRole"
            }
          }
        },
        {
          "name": "permissions",
          "type": "u64"
        }
      ]
    },
    {
      "name": "batchMintCredits",
      "discriminator": [
        171,
        188,
        142,
        157,
        234,
        121,
        108,
        88
      ],
      "accounts": [
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project.owner",
                "account": "project"
              },
              {
                "kind": "account",
                "path": "project.project_id",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "registry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "carbonTokenMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  114,
                  98,
                  111,
                  110,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "project"
          ]
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "amounts",
          "type": {
            "vec": "u64"
          }
        }
      ]
    },
    {
      "name": "buyMarketplaceListing",
      "docs": [
        "Buy carbon credits from marketplace listing"
      ],
      "discriminator": [
        67,
        203,
        113,
        132,
        38,
        72,
        175,
        157
      ],
      "accounts": [
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "listing.project_id",
                "account": "carbonCreditListing"
              },
              {
                "kind": "account",
                "path": "listing.seller",
                "account": "carbonCreditListing"
              }
            ]
          }
        },
        {
          "name": "listingVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "listing"
              }
            ]
          }
        },
        {
          "name": "sellerPaymentAccount",
          "writable": true
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "buyerPaymentAccount",
          "writable": true
        },
        {
          "name": "buyerCreditAccount",
          "writable": true
        },
        {
          "name": "creditMint"
        },
        {
          "name": "currencyMint"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelMarketplaceListing",
      "docs": [
        "Cancel listing and return credits"
      ],
      "discriminator": [
        12,
        37,
        102,
        30,
        184,
        215,
        173,
        54
      ],
      "accounts": [
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "listing.project_id",
                "account": "carbonCreditListing"
              },
              {
                "kind": "account",
                "path": "seller"
              }
            ]
          }
        },
        {
          "name": "listingVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "listing"
              }
            ]
          }
        },
        {
          "name": "seller",
          "writable": true,
          "signer": true
        },
        {
          "name": "sellerCreditAccount",
          "writable": true
        },
        {
          "name": "creditMint"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": []
    },
    {
      "name": "createAuditLog",
      "docs": [
        "Create an audit log entry"
      ],
      "discriminator": [
        251,
        248,
        72,
        101,
        128,
        23,
        80,
        101
      ],
      "accounts": [
        {
          "name": "auditLog",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  100,
                  105,
                  116,
                  95,
                  108,
                  111,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "logId"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "logId",
          "type": "u64"
        },
        {
          "name": "actionType",
          "type": {
            "defined": {
              "name": "auditAction"
            }
          }
        },
        {
          "name": "target",
          "type": "pubkey"
        },
        {
          "name": "success",
          "type": "bool"
        },
        {
          "name": "details",
          "type": "string"
        },
        {
          "name": "proposalId",
          "type": {
            "option": "u64"
          }
        }
      ]
    },
    {
      "name": "createMarketplaceListing",
      "docs": [
        "Create marketplace listing for carbon credits"
      ],
      "discriminator": [
        107,
        166,
        106,
        238,
        18,
        166,
        166,
        203
      ],
      "accounts": [
        {
          "name": "listing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "projectId"
              },
              {
                "kind": "account",
                "path": "seller"
              }
            ]
          }
        },
        {
          "name": "listingVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "listing"
              }
            ]
          }
        },
        {
          "name": "project",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project.owner",
                "account": "project"
              },
              {
                "kind": "account",
                "path": "project.project_id",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "seller",
          "writable": true,
          "signer": true
        },
        {
          "name": "sellerCreditAccount",
          "writable": true
        },
        {
          "name": "creditMint"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "projectId",
          "type": "string"
        },
        {
          "name": "listingData",
          "type": {
            "defined": {
              "name": "marketplaceListingData"
            }
          }
        }
      ]
    },
    {
      "name": "createProposal",
      "docs": [
        "Create a new admin proposal"
      ],
      "discriminator": [
        132,
        116,
        68,
        174,
        216,
        160,
        198,
        22
      ],
      "accounts": [
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "proposalId"
              }
            ]
          }
        },
        {
          "name": "multisigConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "proposerAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "proposer"
              }
            ]
          }
        },
        {
          "name": "proposer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "proposalId",
          "type": "u64"
        },
        {
          "name": "proposalType",
          "type": {
            "defined": {
              "name": "proposalType"
            }
          }
        },
        {
          "name": "target",
          "type": "pubkey"
        },
        {
          "name": "data",
          "type": "bytes"
        },
        {
          "name": "expiresIn",
          "type": "i64"
        }
      ]
    },
    {
      "name": "executeProposal",
      "docs": [
        "Execute an approved proposal"
      ],
      "discriminator": [
        186,
        60,
        116,
        133,
        108,
        128,
        111,
        28
      ],
      "accounts": [
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "proposal.proposal_id",
                "account": "adminProposal"
              }
            ]
          }
        },
        {
          "name": "multisigConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "executorAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "executor"
              }
            ]
          }
        },
        {
          "name": "executor",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "executeTransferHook",
      "discriminator": [
        120,
        157,
        67,
        141,
        88,
        144,
        143,
        220
      ],
      "accounts": [
        {
          "name": "sourceAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  117,
                  114,
                  99,
                  101,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "destinationAccount"
        },
        {
          "name": "ownerDelegate"
        },
        {
          "name": "project",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project.owner",
                "account": "project"
              },
              {
                "kind": "account",
                "path": "project.project_id",
                "account": "project"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "generateImpactReport",
      "docs": [
        "Generate impact report"
      ],
      "discriminator": [
        79,
        69,
        113,
        212,
        18,
        196,
        208,
        73
      ],
      "accounts": [
        {
          "name": "impactReport",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  109,
                  112,
                  97,
                  99,
                  116,
                  95,
                  114,
                  101,
                  112,
                  111,
                  114,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "projectId"
              },
              {
                "kind": "arg",
                "path": "reportingPeriodEnd"
              }
            ]
          }
        },
        {
          "name": "project",
          "writable": true
        },
        {
          "name": "reportGenerator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "projectId",
          "type": "string"
        },
        {
          "name": "reportingPeriodEnd",
          "type": "i64"
        },
        {
          "name": "reportData",
          "type": {
            "defined": {
              "name": "impactReportData"
            }
          }
        }
      ]
    },
    {
      "name": "initializeDoubleCountingRegistry",
      "discriminator": [
        23,
        63,
        69,
        188,
        34,
        223,
        144,
        62
      ],
      "accounts": [
        {
          "name": "doubleCountingRegistry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  117,
                  98,
                  108,
                  101,
                  95,
                  99,
                  111,
                  117,
                  110,
                  116,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeExtraAccountMetaList",
      "discriminator": [
        92,
        197,
        174,
        197,
        41,
        124,
        19,
        3
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "extraAccountMetaList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  116,
                  114,
                  97,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  109,
                  101,
                  116,
                  97,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeMultisig",
      "docs": [
        "Initialize multi-signature configuration"
      ],
      "discriminator": [
        220,
        130,
        117,
        21,
        27,
        227,
        78,
        213
      ],
      "accounts": [
        {
          "name": "multisigConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "registry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "admins",
          "type": {
            "vec": "pubkey"
          }
        },
        {
          "name": "threshold",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializePlatformStats",
      "discriminator": [
        1,
        122,
        37,
        123,
        206,
        171,
        85,
        53
      ],
      "accounts": [
        {
          "name": "stats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializePool",
      "discriminator": [
        95,
        180,
        10,
        172,
        84,
        174,
        232,
        40
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "creditMint"
              },
              {
                "kind": "account",
                "path": "quoteMint"
              }
            ]
          }
        },
        {
          "name": "lpMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "creditMint"
        },
        {
          "name": "quoteMint"
        },
        {
          "name": "creditVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "quoteVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  113,
                  117,
                  111,
                  116,
                  101,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "feeBasisPoints",
          "type": "u16"
        }
      ]
    },
    {
      "name": "initializeRegistry",
      "discriminator": [
        189,
        181,
        20,
        17,
        174,
        57,
        249,
        59
      ],
      "accounts": [
        {
          "name": "registry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "carbonTokenMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  114,
                  98,
                  111,
                  110,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "governmentAuthority"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "decimals",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeVerification",
      "discriminator": [
        128,
        22,
        164,
        95,
        180,
        128,
        48,
        21
      ],
      "accounts": [
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project.owner",
                "account": "project"
              },
              {
                "kind": "account",
                "path": "project.project_id",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "project"
          ]
        },
        {
          "name": "verifier"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "feeLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintCredits",
      "docs": [
        "Legacy mint_credits (deprecated - use mint_verified_credits)"
      ],
      "discriminator": [
        210,
        43,
        79,
        176,
        4,
        212,
        31,
        116
      ],
      "accounts": [
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project.owner",
                "account": "project"
              },
              {
                "kind": "account",
                "path": "project.project_id",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "project"
          ]
        },
        {
          "name": "recipientTokenAccount",
          "writable": true
        },
        {
          "name": "mintAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project.owner",
                "account": "project"
              },
              {
                "kind": "account",
                "path": "project.project_id",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintVerifiedCredits",
      "docs": [
        "Mints carbon credits for verified projects only"
      ],
      "discriminator": [
        255,
        80,
        172,
        188,
        183,
        58,
        97,
        121
      ],
      "accounts": [
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project.owner",
                "account": "project"
              },
              {
                "kind": "account",
                "path": "project.project_id",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "registry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "carbonTokenMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  114,
                  98,
                  111,
                  110,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "recipientTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "recipient"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "carbonTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "project"
          ]
        },
        {
          "name": "recipient"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "multiPartyVerifyProject",
      "docs": [
        "Multi-party project verification with enhanced validation"
      ],
      "discriminator": [
        162,
        76,
        161,
        153,
        50,
        105,
        154,
        105
      ],
      "accounts": [
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project.owner",
                "account": "project"
              },
              {
                "kind": "account",
                "path": "project.project_id",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "verifier",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  101,
                  114,
                  105,
                  102,
                  105,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "verifierAuthority"
              }
            ]
          }
        },
        {
          "name": "verifierAuthority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "verifiedCarbonTons",
          "type": "u64"
        },
        {
          "name": "qualityRating",
          "type": "u8"
        },
        {
          "name": "verificationReportCid",
          "type": "string"
        }
      ]
    },
    {
      "name": "registerProject",
      "docs": [
        "Registers a new project on the blockchain (Universal)"
      ],
      "discriminator": [
        130,
        150,
        121,
        216,
        183,
        225,
        243,
        192
      ],
      "accounts": [
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "projectOwner"
              },
              {
                "kind": "arg",
                "path": "project_data.project_id"
              }
            ]
          }
        },
        {
          "name": "registry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "projectOwner",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "projectOwner"
              }
            ]
          }
        },
        {
          "name": "doubleCountingRegistry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  117,
                  98,
                  108,
                  101,
                  95,
                  99,
                  111,
                  117,
                  110,
                  116,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "projectData",
          "type": {
            "defined": {
              "name": "projectRegistrationData"
            }
          }
        }
      ]
    },
    {
      "name": "registerUser",
      "docs": [
        "Register a new user (Self-Service)"
      ],
      "discriminator": [
        2,
        241,
        150,
        223,
        99,
        214,
        116,
        97
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "registry",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "role",
          "type": {
            "defined": {
              "name": "userRole"
            }
          }
        }
      ]
    },
    {
      "name": "registerVerifier",
      "docs": [
        "Register a verification entity"
      ],
      "discriminator": [
        67,
        234,
        172,
        169,
        184,
        188,
        145,
        156
      ],
      "accounts": [
        {
          "name": "verifier",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  101,
                  114,
                  105,
                  102,
                  105,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "verifierAuthority"
              }
            ]
          }
        },
        {
          "name": "verifierAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "verifierData",
          "type": {
            "defined": {
              "name": "verifierData"
            }
          }
        }
      ]
    },
    {
      "name": "rejectProject",
      "docs": [
        "Rejects a project (consuming fee for validation effort)"
      ],
      "discriminator": [
        249,
        228,
        80,
        234,
        192,
        45,
        243,
        145
      ],
      "accounts": [
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project.owner",
                "account": "project"
              },
              {
                "kind": "account",
                "path": "project.project_id",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "registry",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "adminAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "reason",
          "type": "string"
        }
      ]
    },
    {
      "name": "removeLiquidity",
      "discriminator": [
        80,
        85,
        209,
        72,
        24,
        206,
        177,
        108
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.credit_mint",
                "account": "liquidityPool"
              },
              {
                "kind": "account",
                "path": "pool.quote_mint",
                "account": "liquidityPool"
              }
            ]
          }
        },
        {
          "name": "lpMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "creditVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "quoteVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  113,
                  117,
                  111,
                  116,
                  101,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "creditMint"
        },
        {
          "name": "quoteMint"
        },
        {
          "name": "userCreditAccount",
          "writable": true
        },
        {
          "name": "userQuoteAccount",
          "writable": true
        },
        {
          "name": "userLpAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "provider"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "lpMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "provider",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "lpAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "retireCredits",
      "docs": [
        "Retires carbon credits by transferring them to a burn account"
      ],
      "discriminator": [
        0,
        223,
        106,
        1,
        228,
        82,
        170,
        45
      ],
      "accounts": [
        {
          "name": "creditMint",
          "writable": true
        },
        {
          "name": "userTokenAccount",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "certificateMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  116,
                  105,
                  114,
                  101,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "arg",
                "path": "retirementId"
              }
            ]
          }
        },
        {
          "name": "certificateTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "token2022Program"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "retirementId",
          "type": "string"
        }
      ]
    },
    {
      "name": "revokeRole",
      "docs": [
        "Revoke a user's role"
      ],
      "discriminator": [
        179,
        232,
        2,
        180,
        48,
        227,
        82,
        7
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user_account.authority",
                "account": "userAccount"
              }
            ]
          }
        },
        {
          "name": "registry",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "submitMonitoringData",
      "docs": [
        "Submit environmental monitoring data"
      ],
      "discriminator": [
        98,
        35,
        18,
        173,
        22,
        203,
        211,
        154
      ],
      "accounts": [
        {
          "name": "monitoringData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  111,
                  110,
                  105,
                  116,
                  111,
                  114,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "projectId"
              },
              {
                "kind": "arg",
                "path": "timestamp"
              }
            ]
          }
        },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project.owner",
                "account": "project"
              },
              {
                "kind": "account",
                "path": "project.project_id",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "dataProvider",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "projectId",
          "type": "string"
        },
        {
          "name": "timestamp",
          "type": "i64"
        },
        {
          "name": "monitoringData",
          "type": {
            "defined": {
              "name": "monitoringDataInput"
            }
          }
        }
      ]
    },
    {
      "name": "swap",
      "discriminator": [
        248,
        198,
        158,
        145,
        225,
        117,
        135,
        200
      ],
      "accounts": [
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.credit_mint",
                "account": "liquidityPool"
              },
              {
                "kind": "account",
                "path": "pool.quote_mint",
                "account": "liquidityPool"
              }
            ]
          }
        },
        {
          "name": "creditVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "quoteVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  113,
                  117,
                  111,
                  116,
                  101,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "creditMint"
        },
        {
          "name": "quoteMint"
        },
        {
          "name": "userSourceAccount",
          "writable": true
        },
        {
          "name": "userDestinationAccount",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "minAmountOut",
          "type": "u64"
        }
      ]
    },
    {
      "name": "trackImpact",
      "docs": [
        "Track environmental impact data"
      ],
      "discriminator": [
        8,
        247,
        42,
        96,
        108,
        8,
        80,
        27
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": {
              "name": "impactData"
            }
          }
        }
      ]
    },
    {
      "name": "tradeCredits",
      "docs": [
        "Trade credits (placeholder for internal trading logic)"
      ],
      "discriminator": [
        70,
        77,
        180,
        116,
        45,
        203,
        164,
        108
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferCredits",
      "docs": [
        "Transfers carbon credits from one token account to another"
      ],
      "discriminator": [
        193,
        72,
        117,
        37,
        181,
        135,
        246,
        15
      ],
      "accounts": [
        {
          "name": "fromAccount",
          "writable": true
        },
        {
          "name": "toAccount",
          "writable": true
        },
        {
          "name": "fromAuthority",
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateRole",
      "docs": [
        "Update an existing user's role"
      ],
      "discriminator": [
        36,
        223,
        162,
        98,
        168,
        209,
        75,
        151
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user_account.authority",
                "account": "userAccount"
              }
            ]
          }
        },
        {
          "name": "registry",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "newRole",
          "type": {
            "defined": {
              "name": "userRole"
            }
          }
        },
        {
          "name": "newPermissions",
          "type": "u64"
        }
      ]
    },
    {
      "name": "verifyProject",
      "docs": [
        "Verifies a project, allowing it to mint carbon credits"
      ],
      "discriminator": [
        185,
        69,
        182,
        89,
        5,
        45,
        19,
        179
      ],
      "accounts": [
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "project.owner",
                "account": "project"
              },
              {
                "kind": "account",
                "path": "project.project_id",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "registry",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  118,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "adminAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "verifiedCarbonTons",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "adminProposal",
      "discriminator": [
        107,
        249,
        66,
        11,
        147,
        28,
        12,
        239
      ]
    },
    {
      "name": "auditLog",
      "discriminator": [
        230,
        207,
        176,
        233,
        170,
        130,
        101,
        244
      ]
    },
    {
      "name": "carbonCreditListing",
      "discriminator": [
        205,
        167,
        142,
        84,
        219,
        152,
        204,
        53
      ]
    },
    {
      "name": "doubleCountingRegistry",
      "discriminator": [
        154,
        220,
        57,
        5,
        77,
        88,
        177,
        246
      ]
    },
    {
      "name": "globalRegistry",
      "discriminator": [
        100,
        213,
        140,
        104,
        66,
        152,
        15,
        238
      ]
    },
    {
      "name": "impactReport",
      "discriminator": [
        34,
        96,
        240,
        56,
        227,
        89,
        198,
        11
      ]
    },
    {
      "name": "liquidityPool",
      "discriminator": [
        66,
        38,
        17,
        64,
        188,
        80,
        68,
        129
      ]
    },
    {
      "name": "monitoringData",
      "discriminator": [
        227,
        98,
        53,
        103,
        195,
        21,
        12,
        228
      ]
    },
    {
      "name": "multiSigConfig",
      "discriminator": [
        205,
        172,
        149,
        81,
        192,
        109,
        234,
        28
      ]
    },
    {
      "name": "platformStats",
      "discriminator": [
        230,
        145,
        51,
        113,
        44,
        85,
        153,
        126
      ]
    },
    {
      "name": "project",
      "discriminator": [
        205,
        168,
        189,
        202,
        181,
        247,
        142,
        19
      ]
    },
    {
      "name": "userAccount",
      "discriminator": [
        211,
        33,
        136,
        16,
        186,
        110,
        242,
        127
      ]
    },
    {
      "name": "verificationNode",
      "discriminator": [
        146,
        19,
        185,
        141,
        119,
        125,
        56,
        85
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "projectNotVerified",
      "msg": "Project is not verified"
    },
    {
      "code": 6001,
      "name": "exceedsVerifiedCapacity",
      "msg": "Amount exceeds verified carbon capacity"
    },
    {
      "code": 6002,
      "name": "projectAlreadyProcessed",
      "msg": "Project has already been processed"
    },
    {
      "code": 6003,
      "name": "verifierNotActive",
      "msg": "Verifier is not active"
    },
    {
      "code": 6004,
      "name": "invalidQualityRating",
      "msg": "Invalid quality rating (must be 1-5)"
    },
    {
      "code": 6005,
      "name": "exceedsAvailableQuantity",
      "msg": "Exceeds available quantity"
    },
    {
      "code": 6006,
      "name": "invalidEcosystemType",
      "msg": "Invalid ecosystem type"
    },
    {
      "code": 6007,
      "name": "insufficientMonitoringData",
      "msg": "Insufficient monitoring data"
    },
    {
      "code": 6008,
      "name": "invalidCarbonMeasurement",
      "msg": "Invalid carbon measurement"
    },
    {
      "code": 6009,
      "name": "complianceValidationFailed",
      "msg": "Compliance validation failed"
    },
    {
      "code": 6010,
      "name": "insufficientCredits",
      "msg": "Not enough credits to trade."
    },
    {
      "code": 6011,
      "name": "complianceNotApproved",
      "msg": "Government Compliance Audit Not Approved"
    },
    {
      "code": 6012,
      "name": "liquidityZero",
      "msg": "Liquidity amount must be greater than zero"
    },
    {
      "code": 6013,
      "name": "mathOverflow",
      "msg": "Math overflow occurred"
    },
    {
      "code": 6014,
      "name": "slippageExceeded",
      "msg": "Slippage tolerance exceeded"
    },
    {
      "code": 6015,
      "name": "insufficientFunds",
      "msg": "Insufficient funds for operation"
    },
    {
      "code": 6016,
      "name": "instructionFailed",
      "msg": "Instruction failed"
    },
    {
      "code": 6017,
      "name": "userNotActive",
      "msg": "User account is not active"
    },
    {
      "code": 6018,
      "name": "insufficientPermissions",
      "msg": "User does not have required permissions"
    },
    {
      "code": 6019,
      "name": "unauthorizedVerifier",
      "msg": "Unauthorized: Verifier does not match assigned project verifier"
    }
  ],
  "types": [
    {
      "name": "adminProposal",
      "docs": [
        "Multi-signature admin proposal"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proposalId",
            "type": "u64"
          },
          {
            "name": "proposalType",
            "type": {
              "defined": {
                "name": "proposalType"
              }
            }
          },
          {
            "name": "proposer",
            "type": "pubkey"
          },
          {
            "name": "target",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "expiresAt",
            "type": "i64"
          },
          {
            "name": "executed",
            "type": "bool"
          },
          {
            "name": "cancelled",
            "type": "bool"
          },
          {
            "name": "approvals",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "rejections",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "requiredApprovals",
            "type": "u8"
          },
          {
            "name": "data",
            "type": "bytes"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "auditAction",
      "docs": [
        "Types of actions to audit"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "roleAssigned"
          },
          {
            "name": "roleRevoked"
          },
          {
            "name": "projectVerified"
          },
          {
            "name": "projectRejected"
          },
          {
            "name": "creditsMinted"
          },
          {
            "name": "creditsRetired"
          },
          {
            "name": "proposalCreated"
          },
          {
            "name": "proposalApproved"
          },
          {
            "name": "proposalRejected"
          },
          {
            "name": "proposalExecuted"
          },
          {
            "name": "adminAdded"
          },
          {
            "name": "adminRemoved"
          },
          {
            "name": "registryInitialized"
          },
          {
            "name": "systemPaused"
          },
          {
            "name": "systemUnpaused"
          },
          {
            "name": "settingsUpdated"
          }
        ]
      }
    },
    {
      "name": "auditLog",
      "docs": [
        "Audit log entry for tracking all admin actions"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "logId",
            "type": "u64"
          },
          {
            "name": "actionType",
            "type": {
              "defined": {
                "name": "auditAction"
              }
            }
          },
          {
            "name": "performedBy",
            "type": "pubkey"
          },
          {
            "name": "target",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "success",
            "type": "bool"
          },
          {
            "name": "details",
            "type": "string"
          },
          {
            "name": "proposalId",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "carbonCreditListing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectId",
            "type": "string"
          },
          {
            "name": "seller",
            "type": "pubkey"
          },
          {
            "name": "vintageYear",
            "type": "u16"
          },
          {
            "name": "quantityAvailable",
            "type": "u64"
          },
          {
            "name": "pricePerTon",
            "type": "u64"
          },
          {
            "name": "qualityRating",
            "type": "u8"
          },
          {
            "name": "coBenefits",
            "type": {
              "vec": {
                "defined": {
                  "name": "coBenefit"
                }
              }
            }
          },
          {
            "name": "certificationStandards",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "currencyMint",
            "type": "pubkey"
          },
          {
            "name": "listingDate",
            "type": "i64"
          },
          {
            "name": "expiryDate",
            "type": "i64"
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "coBenefit",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "biodiversityConservation"
          },
          {
            "name": "communityLivelihoods"
          },
          {
            "name": "coastalProtection"
          },
          {
            "name": "waterQuality"
          },
          {
            "name": "fisheryEnhancement"
          },
          {
            "name": "tourismDevelopment"
          },
          {
            "name": "educationOutreach"
          },
          {
            "name": "energySecurity"
          },
          {
            "name": "airQualityImprovement"
          }
        ]
      }
    },
    {
      "name": "communityBenefit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "benefitType",
            "type": "string"
          },
          {
            "name": "householdsAffected",
            "type": "u32"
          },
          {
            "name": "jobsCreated",
            "type": "u32"
          },
          {
            "name": "incomeIncreasePercentage",
            "type": "f64"
          },
          {
            "name": "capacityBuildingPrograms",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "complianceState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cctsRegistryId",
            "type": "string"
          },
          {
            "name": "loaIssued",
            "type": "bool"
          },
          {
            "name": "doubleCountingPreventionId",
            "type": "string"
          },
          {
            "name": "auditStatus",
            "type": "string"
          },
          {
            "name": "authorizedExportLimit",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "doubleCountingRegistry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "registeredLocations",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "economicImpact",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "directRevenue",
            "type": "u64"
          },
          {
            "name": "indirectBenefits",
            "type": "u64"
          },
          {
            "name": "costSavings",
            "type": "u64"
          },
          {
            "name": "roiPercentage",
            "type": "f64"
          },
          {
            "name": "paybackPeriodYears",
            "type": "f64"
          }
        ]
      }
    },
    {
      "name": "geoLocation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "latitude",
            "type": "f64"
          },
          {
            "name": "longitude",
            "type": "f64"
          },
          {
            "name": "polygonCoordinates",
            "type": {
              "vec": {
                "array": [
                  "f64",
                  2
                ]
              }
            }
          },
          {
            "name": "countryCode",
            "type": "string"
          },
          {
            "name": "regionName",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "globalRegistry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalCreditsIssued",
            "type": "u64"
          },
          {
            "name": "totalProjects",
            "type": "u64"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "governmentAuthority",
            "type": "pubkey"
          },
          {
            "name": "mintAuthority",
            "type": "pubkey"
          },
          {
            "name": "carbonTokenMint",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "mintAuthorityBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "impactData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "co2Absorbed",
            "type": "f64"
          },
          {
            "name": "biodiversityIndex",
            "type": "f64"
          }
        ]
      }
    },
    {
      "name": "impactReport",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectId",
            "type": "string"
          },
          {
            "name": "reportingPeriodStart",
            "type": "i64"
          },
          {
            "name": "reportingPeriodEnd",
            "type": "i64"
          },
          {
            "name": "carbonSequestered",
            "type": "f64"
          },
          {
            "name": "ecosystemHealthImprovement",
            "type": "f64"
          },
          {
            "name": "biodiversityIncrease",
            "type": "f64"
          },
          {
            "name": "communityBenefits",
            "type": {
              "vec": {
                "defined": {
                  "name": "communityBenefit"
                }
              }
            }
          },
          {
            "name": "economicImpact",
            "type": {
              "defined": {
                "name": "economicImpact"
              }
            }
          },
          {
            "name": "sdgContributions",
            "type": "bytes"
          },
          {
            "name": "verificationReportCid",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "impactReportData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectId",
            "type": "string"
          },
          {
            "name": "reportingPeriodStart",
            "type": "i64"
          },
          {
            "name": "reportingPeriodEnd",
            "type": "i64"
          },
          {
            "name": "carbonSequestered",
            "type": "f64"
          },
          {
            "name": "ecosystemHealthImprovement",
            "type": "f64"
          },
          {
            "name": "communityBenefits",
            "type": {
              "vec": {
                "defined": {
                  "name": "communityBenefit"
                }
              }
            }
          },
          {
            "name": "economicImpact",
            "type": {
              "defined": {
                "name": "economicImpact"
              }
            }
          },
          {
            "name": "sdgContributions",
            "type": "bytes"
          },
          {
            "name": "verificationReportCid",
            "type": "string"
          },
          {
            "name": "speciesCountCurrent",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "liquidityPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "creditMint",
            "type": "pubkey"
          },
          {
            "name": "quoteMint",
            "type": "pubkey"
          },
          {
            "name": "creditVault",
            "type": "pubkey"
          },
          {
            "name": "quoteVault",
            "type": "pubkey"
          },
          {
            "name": "lpMint",
            "type": "pubkey"
          },
          {
            "name": "feeBasisPoints",
            "type": "u16"
          },
          {
            "name": "totalLiquidity",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "marketplaceListingData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectId",
            "type": "string"
          },
          {
            "name": "vintageYear",
            "type": "u16"
          },
          {
            "name": "quantityAvailable",
            "type": "u64"
          },
          {
            "name": "pricePerTon",
            "type": "u64"
          },
          {
            "name": "certificationStandards",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "currencyMint",
            "type": "pubkey"
          },
          {
            "name": "expiryDate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "monitoringData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectId",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "satelliteImageryCid",
            "type": "string"
          },
          {
            "name": "ndviIndex",
            "type": "f64"
          },
          {
            "name": "waterQuality",
            "type": {
              "defined": {
                "name": "waterQuality"
              }
            }
          },
          {
            "name": "temperatureData",
            "type": {
              "vec": "f64"
            }
          },
          {
            "name": "tideData",
            "type": {
              "vec": {
                "defined": {
                  "name": "tideReading"
                }
              }
            }
          },
          {
            "name": "iotSensorData",
            "type": {
              "vec": {
                "defined": {
                  "name": "sensorReading"
                }
              }
            }
          },
          {
            "name": "ecosystemHealthScore",
            "type": "f64"
          }
        ]
      }
    },
    {
      "name": "monitoringDataInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectId",
            "type": "string"
          },
          {
            "name": "satelliteImageryCid",
            "type": "string"
          },
          {
            "name": "ndviIndex",
            "type": "f64"
          },
          {
            "name": "waterQuality",
            "type": {
              "defined": {
                "name": "waterQuality"
              }
            }
          },
          {
            "name": "temperatureData",
            "type": {
              "vec": "f64"
            }
          },
          {
            "name": "tideData",
            "type": {
              "vec": {
                "defined": {
                  "name": "tideReading"
                }
              }
            }
          },
          {
            "name": "iotSensorData",
            "type": {
              "vec": {
                "defined": {
                  "name": "sensorReading"
                }
              }
            }
          },
          {
            "name": "ecosystemHealthScore",
            "type": "f64"
          }
        ]
      }
    },
    {
      "name": "multiSigConfig",
      "docs": [
        "Multi-sig configuration"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admins",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "threshold",
            "type": "u8"
          },
          {
            "name": "proposalCount",
            "type": "u64"
          },
          {
            "name": "isEnabled",
            "type": "bool"
          },
          {
            "name": "emergencyAdmin",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "nutrientLevels",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nitrogen",
            "type": "f64"
          },
          {
            "name": "phosphorus",
            "type": "f64"
          },
          {
            "name": "potassium",
            "type": "f64"
          }
        ]
      }
    },
    {
      "name": "platformStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalRegisteredUsers",
            "type": "u64"
          },
          {
            "name": "totalValidators",
            "type": "u64"
          },
          {
            "name": "totalTransactions",
            "type": "u64"
          },
          {
            "name": "totalVolumeCredits",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "project",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectId",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "ipfsCid",
            "type": "string"
          },
          {
            "name": "carbonTonsEstimated",
            "type": "u64"
          },
          {
            "name": "verificationStatus",
            "type": {
              "defined": {
                "name": "verificationStatus"
              }
            }
          },
          {
            "name": "creditsIssued",
            "type": "u64"
          },
          {
            "name": "tokensMinted",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "projectSector",
            "type": {
              "defined": {
                "name": "projectSector"
              }
            }
          },
          {
            "name": "location",
            "type": {
              "defined": {
                "name": "geoLocation"
              }
            }
          },
          {
            "name": "areaHectares",
            "type": "f64"
          },
          {
            "name": "establishmentDate",
            "type": "i64"
          },
          {
            "name": "compliance",
            "type": {
              "defined": {
                "name": "complianceState"
              }
            }
          },
          {
            "name": "verifier",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "verificationFeeLamports",
            "type": "u64"
          },
          {
            "name": "auditEscrowBalance",
            "type": "u64"
          },
          {
            "name": "verificationData",
            "type": {
              "defined": {
                "name": "verificationData"
              }
            }
          },
          {
            "name": "vintageYear",
            "type": "u16"
          },
          {
            "name": "pricePerTon",
            "type": "u64"
          },
          {
            "name": "availableQuantity",
            "type": "u64"
          },
          {
            "name": "qualityRating",
            "type": "u8"
          },
          {
            "name": "coBenefits",
            "type": {
              "vec": {
                "defined": {
                  "name": "coBenefit"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "projectRegistrationData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectId",
            "type": "string"
          },
          {
            "name": "ipfsCid",
            "type": "string"
          },
          {
            "name": "carbonTonsEstimated",
            "type": "u64"
          },
          {
            "name": "projectSector",
            "type": {
              "defined": {
                "name": "projectSector"
              }
            }
          },
          {
            "name": "location",
            "type": {
              "defined": {
                "name": "geoLocation"
              }
            }
          },
          {
            "name": "areaHectares",
            "type": "f64"
          },
          {
            "name": "establishmentDate",
            "type": "i64"
          },
          {
            "name": "vintageYear",
            "type": "u16"
          },
          {
            "name": "pricePerTon",
            "type": "u64"
          },
          {
            "name": "cctsRegistryId",
            "type": "string"
          },
          {
            "name": "complianceIdSignature",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "projectSector",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "blueCarbon"
          },
          {
            "name": "forestry"
          },
          {
            "name": "renewableEnergy"
          },
          {
            "name": "wasteManagement"
          },
          {
            "name": "agriculture"
          },
          {
            "name": "industrial"
          }
        ]
      }
    },
    {
      "name": "proposalType",
      "docs": [
        "Types of proposals that can be created"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "assignRole"
          },
          {
            "name": "revokeRole"
          },
          {
            "name": "addAdmin"
          },
          {
            "name": "removeAdmin"
          },
          {
            "name": "updateRegistry"
          },
          {
            "name": "emergencyPause"
          },
          {
            "name": "transferAuthority"
          },
          {
            "name": "updateThreshold"
          }
        ]
      }
    },
    {
      "name": "sensorReading",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sensorId",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "co2Flux",
            "type": "f64"
          },
          {
            "name": "soilMoisture",
            "type": "f64"
          },
          {
            "name": "phLevel",
            "type": "f64"
          },
          {
            "name": "temperature",
            "type": "f64"
          },
          {
            "name": "humidity",
            "type": "f64"
          }
        ]
      }
    },
    {
      "name": "tideReading",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "tideHeight",
            "type": "f64"
          },
          {
            "name": "tideType",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "userAccount",
      "docs": [
        "On-chain user account storing role and permissions"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "role",
            "type": {
              "defined": {
                "name": "userRole"
              }
            }
          },
          {
            "name": "assignedBy",
            "type": "pubkey"
          },
          {
            "name": "assignedAt",
            "type": "i64"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "permissions",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "userRole",
      "docs": [
        "User roles for on-chain access control"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "none"
          },
          {
            "name": "user"
          },
          {
            "name": "validator"
          },
          {
            "name": "government"
          },
          {
            "name": "admin"
          },
          {
            "name": "superAdmin"
          }
        ]
      }
    },
    {
      "name": "verificationData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "satelliteDataHash",
            "type": "string"
          },
          {
            "name": "iotDataHash",
            "type": "string"
          },
          {
            "name": "acvaReportCid",
            "type": "string"
          },
          {
            "name": "lastVerificationDate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "verificationNode",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "verifierPubkey",
            "type": "pubkey"
          },
          {
            "name": "verifierType",
            "type": {
              "defined": {
                "name": "verifierType"
              }
            }
          },
          {
            "name": "credentials",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "reputationScore",
            "type": "u64"
          },
          {
            "name": "verificationCount",
            "type": "u64"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "registrationDate",
            "type": "i64"
          },
          {
            "name": "specializations",
            "type": {
              "vec": {
                "defined": {
                  "name": "projectSector"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "verificationStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "awaitingAudit"
          },
          {
            "name": "underReview"
          },
          {
            "name": "verified"
          },
          {
            "name": "rejected"
          },
          {
            "name": "monitoring"
          },
          {
            "name": "expired"
          }
        ]
      }
    },
    {
      "name": "verifierData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "verifierType",
            "type": {
              "defined": {
                "name": "verifierType"
              }
            }
          },
          {
            "name": "credentials",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "specializations",
            "type": {
              "vec": {
                "defined": {
                  "name": "projectSector"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "verifierType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "scientificInstitution"
          },
          {
            "name": "governmentAgency"
          },
          {
            "name": "certificationBody"
          },
          {
            "name": "localCommunity"
          },
          {
            "name": "technicalAuditor"
          },
          {
            "name": "thirdPartyValidator"
          }
        ]
      }
    },
    {
      "name": "waterQuality",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "phLevel",
            "type": "f64"
          },
          {
            "name": "salinity",
            "type": "f64"
          },
          {
            "name": "dissolvedOxygen",
            "type": "f64"
          },
          {
            "name": "turbidity",
            "type": "f64"
          },
          {
            "name": "nutrients",
            "type": {
              "defined": {
                "name": "nutrientLevels"
              }
            }
          }
        ]
      }
    }
  ]
};
