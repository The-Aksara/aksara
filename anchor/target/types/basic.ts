/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/basic.json`.
 */
export type Basic = {
  "address": "A8DkqbrM8cz1wvBxv9CzR8SfeZA95LsB7WCxjxDTurMX",
  "metadata": {
    "name": "basic",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createNote",
      "discriminator": [
        103,
        2,
        208,
        242,
        86,
        156,
        151,
        107
      ],
      "accounts": [
        {
          "name": "note",
          "writable": true,
          "signer": true
        },
        {
          "name": "author",
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
          "name": "title",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": "string"
        }
      ]
    },
    {
      "name": "hideNote",
      "discriminator": [
        151,
        159,
        53,
        115,
        155,
        53,
        93,
        151
      ],
      "accounts": [
        {
          "name": "note",
          "writable": true
        },
        {
          "name": "author",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "showNote",
      "discriminator": [
        203,
        46,
        234,
        122,
        236,
        216,
        191,
        217
      ],
      "accounts": [
        {
          "name": "note",
          "writable": true
        },
        {
          "name": "author",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "updateNote",
      "discriminator": [
        103,
        129,
        251,
        34,
        33,
        154,
        210,
        148
      ],
      "accounts": [
        {
          "name": "note",
          "writable": true
        },
        {
          "name": "author",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "note",
      "discriminator": [
        203,
        75,
        252,
        196,
        81,
        210,
        122,
        126
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "You are not unauthorized to modify this note."
    }
  ],
  "types": [
    {
      "name": "note",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "contentHash",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "hidden",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
