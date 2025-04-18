import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import assert from 'assert';
import { Basic } from '../target/types/basic';

describe('basic', () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env())
    const provider = anchor.getProvider();
    const program = anchor.workspace.Basic as Program<Basic>

    let noteKeypair: anchor.web3.Keypair;

    it('Create a Note', async () => {
        noteKeypair = anchor.web3.Keypair.generate()
        const title = "test 1"
        const contentHash = 'content 1'

        await program.methods.createNote(title, contentHash)
            .accounts({
                note: noteKeypair.publicKey,
                author: provider.publicKey,
            })
            .signers([noteKeypair])
            .rpc()

        const noteAccount = await program.account.note.fetch(noteKeypair.publicKey)
        assert.equal(noteAccount.title, title);
        assert.equal(noteAccount.contentHash, contentHash);
        assert.equal(noteAccount.author.toBase58(), provider.publicKey?.toBase58());
        assert.equal(noteAccount.hidden, false);
    })

    it('Update a Note', async () => {
        const newTitle = 'Updated Note Title';
        const newContentHash = 'QmUpdatedExampleHash987654';

        await program.methods.updateNote(newTitle, newContentHash)
            .accounts({
                note: noteKeypair.publicKey,
                author: provider.publicKey,
            })
            .rpc();

        const updatedNote = await program.account.note.fetch(noteKeypair.publicKey);
        assert.equal(updatedNote.title, newTitle);
        assert.equal(updatedNote.contentHash, newContentHash);
    })

    it('Soft Delete Note', async () => {
        await program.methods.hideNote()
            .accounts({
                note: noteKeypair.publicKey,
                author: provider.publicKey,
            })
            .rpc();

        const hiddenNote = await program.account.note.fetch(noteKeypair.publicKey);
        assert.equal(hiddenNote.hidden, true);
    })
})
