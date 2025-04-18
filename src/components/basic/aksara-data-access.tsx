'use client'

import { getBasicProgram, BASIC_PROGRAM_ID as programId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Keypair, PublicKey } from '@solana/web3.js'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useAksaraProgram() {
   const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const program = getBasicProgram(provider)
  const queryClient = useQueryClient()

  const createNote = useMutation({
    mutationKey: ['aksara', 'createNote', { cluster }],
    mutationFn: async ({ title, contentHash }: { title: string, contentHash: string }) => {
      const note = Keypair.generate()
      const tx = await program.methods.createNote(title, contentHash)
        .accounts({
          note: note.publicKey,
          author: provider.publicKey,
        })
        .signers([note])
        .rpc()
      return tx
    },
    onSuccess: (signature) => {
      transactionToast(signature)
    },
    onError: () => toast.error('Failed to create note'),
  })

  const updateNote = useMutation({
    mutationKey: ['aksara', 'updateNote', { cluster }],
    mutationFn: async ({ noteId, title, contentHash }: { noteId: string, title: string, contentHash: string }) => {
      const notePublicKey = new PublicKey(noteId)
      const tx = await program.methods.updateNote(title, contentHash)
        .accounts({
          note: notePublicKey,
          author: provider.publicKey,
        })
        .rpc()
      return tx
    },
    onSuccess: (signature) => {
      transactionToast(signature)
    },
    onError: () => toast.error('Failed to update note'),
  })

  const hideNote = useMutation({
    mutationKey: ['aksara', 'hideNote', { cluster }],
    mutationFn: async ({ noteId }: { noteId: string }) => {
      const publicKey = new PublicKey(noteId)
      return await program.methods.hideNote().accounts({ note: publicKey }).rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Note hidden successfully')
      queryClient.invalidateQueries()
    },
    onError: () => toast.error('Failed to hide the note'),
  })

  const showNote = useMutation({
    mutationKey: ['aksara', 'showNote', { cluster }],
    mutationFn: async ({ noteId }: { noteId: string }) => {
      const publicKey = new PublicKey(noteId)
      return await program.methods.showNote().accounts({ note: publicKey }).rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Show Note successfully')
      queryClient.invalidateQueries()
    },
    onError: () => toast.error('Failed to show the note'),
  })


  return {
    program,
    programId,
    createNote,
    updateNote,
    hideNote,
    showNote
  }
}
