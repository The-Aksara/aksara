'use client'

import { Dialog } from '@headlessui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { useAksaraProgram } from './aksara-data-access'
import { CreateNoteForm } from './aksara-ui'

export default function BasicFeature() {
  const { publicKey } = useWallet()
  const { programId, program } = useAksaraProgram()

  const [allNotes, setAllNotes] = useState<any[]>([])
  const [showMyNotes, setShowMyNotes] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function fetchNotes() {
      if (program) {
        const notes = await program.account.note.all()
        setAllNotes(notes)
      }
    }
    fetchNotes()
  }, [program])

  // Derived state for displayed notes
  const displayedNotes = showMyNotes
    ? allNotes.filter(note => 
        note.account.author.toBase58() === publicKey?.toBase58()
      )
    : allNotes.filter(note => !note.account.hidden)

  const handleToggleView = () => {
    setShowMyNotes(prev => !prev)
  }

  return publicKey ? (
    <div className="p-4 max-w-4xl mx-auto">
      <AppHero title="Aksara" subtitle={'Browse existing notes or create a new one.'}>
        <div className="flex justify-between items-center mb-6">
          <p>
            <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
          </p>
          <div className="flex gap-4">
            
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              Create Note
            </button>
          </div>
        </div>

        <div >
          <button
              className="btn btn-secondary"
              onClick={handleToggleView}
            >
              {showMyNotes ? "Show All Notes" : "Show My Notes"}
            </button>
        </div>

        <div className="space-y-4">
          {displayedNotes.map(({ account, publicKey: notePublicKey }, i) => (
            <div key={i} className="p-4 bg-base-200 rounded shadow">
              <Link href={`/note/${notePublicKey.toString()}`}>
                <h2 className="font-bold">{account.title}</h2>
                {account.hidden && (
                  <span className="text-xs text-red-500 ml-2">(Hidden)</span>
                )}
              </Link>
            </div>
          ))}
        </div>
      </AppHero>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <div className="relative z-50 w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
          <CreateNoteForm />

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}