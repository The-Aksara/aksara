'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { format } from 'date-fns'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAksaraProgram } from './aksara-data-access'
import { UpdateNoteForm } from './aksara-ui'

export default function NoteDetailPage() {
  const { program, hideNote, showNote } = useAksaraProgram()
  const { publicKey } = useWallet()
  const params = useParams()
  const noteId = params?.noteId as string
  const [note, setNote] = useState<any>(null)
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  useEffect(() => {
    async function fetchNote() {
      if (!program || !noteId) return
      const publicKey = new PublicKey(noteId)
      const fetchedNote = await program.account.note.fetch(publicKey)
      setNote(fetchedNote)
    }
    fetchNote()
  }, [program, noteId])

  if (!note) return <div className="p-4">Loading note...</div>

  const isOwner = publicKey?.toBase58() === note.author.toBase58()

  const handleHide = async () => {
    await hideNote.mutateAsync({ noteId })
  }

  const handleShow = async () => {
    await showNote.mutateAsync({ noteId })
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold">{note.title}</h1>
        {isOwner && (
          <div className="space-x-2">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setShowUpdateForm(!showUpdateForm)}
            >
              {showUpdateForm ? 'Cancel' : 'Update'}
            </button>
            {note.hidden ? (
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleShow}
                disabled={hideNote.isPending}
              >
                {hideNote.isPending ? 'Showing...' : 'Show'}
              </button>
            ) : (
              <button
                className="btn btn-sm btn-error"
                onClick={handleHide}
                disabled={hideNote.isPending}
              >
                {hideNote.isPending ? 'Hiding...' : 'Hide'}
              </button>
            )}
          </div>
        )}
      </div>

      {showUpdateForm && (
        <UpdateNoteForm
          noteId={noteId}
          initialTitle={note.title}
          initialContentHash={note.contentHash}
        />
      )}

      {!showUpdateForm && (
        <p className="text-lg text-gray-300">{note.contentHash}</p>
      )}

      <p>{ note.hidden }</p>

      <div className="text-right text-sm text-gray-500 mt-12">
        {format(new Date(note.timestamp.toNumber() * 1000), 'PPPppp')}
      </div>
    </div>
  )
}
