'use client'

import { PublicKey } from '@solana/web3.js'
import { format } from 'date-fns'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAksaraProgram } from './aksara-data-access'


export function CreateNoteForm() {
  const { createNote } = useAksaraProgram()
  const [title, setTitle] = useState('')
  const [contentHash, setContentHash] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createNote.mutateAsync({ title, contentHash })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Title</label>
        <input
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="label">Content</label>
        <textarea
          className="textarea textarea-bordered w-full"
          value={contentHash}
          onChange={(e) => setContentHash(e.target.value)}
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={createNote.isPending}
      >
        {createNote.isPending ? 'Creating...' : 'Create Note'}
      </button>
    </form>
  )
}

export default function NoteDetailPage() {
  const { program } = useAksaraProgram()
  const params = useParams()
  const noteId = params?.noteId as string
  const [note, setNote] = useState<any>(null)

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

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{note.title}</h1>
      <p className="text-lg text-gray-300">{note.contentHash}</p>
      <div className="text-right text-sm text-gray-500 mt-12">
        {format(new Date(note.timestamp.toNumber() * 1000), 'PPPppp')}
      </div>
    </div>
  )
}

export function UpdateNoteForm({ noteId, initialTitle, initialContentHash, onDone }: { noteId: string, initialTitle: string, initialContentHash: string, onDone?: () => void }) {
  const { updateNote } = useAksaraProgram()
  const [title, setTitle] = useState(initialTitle)
  const [contentHash, setContentHash] = useState(initialContentHash)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateNote.mutateAsync({ noteId, title, contentHash })
    onDone?.()
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div>
        <label className="label">Title</label>
        <input
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
          <label className="label">Content</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={contentHash}
            onChange={(e) => setContentHash(e.target.value)}
            rows={4}
            required
          />
        </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={updateNote.isPending}
      >
        {updateNote.isPending ? 'Updating...' : 'Update Note'}
      </button>
    </form>
  )
}
