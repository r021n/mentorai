import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { X, Image as ImageIcon } from 'lucide-react'
import { questionsApi } from '../../lib/api/questions'
import type { Question } from '../../lib/types/question.types'
import { toast } from '../../lib/stores/toast'
import { Modal } from '../../lib/components/ui/Modal'
import { Button } from '../../lib/components/ui/Button'
import { Spinner } from '../../lib/components/ui/Spinner'

export interface QuestionFormModalProps {
  isOpen: boolean
  topicId: number
  questionToEdit: Question | null
  onClose: () => void
  onSaved: () => void
}

export function QuestionFormModal({
  isOpen,
  topicId,
  questionToEdit,
  onClose,
  onSaved,
}: QuestionFormModalProps) {
  const [questionText, setQuestionText] = useState('')
  const [imageDescription, setImageDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [prevIsOpen, setPrevIsOpen] = useState(false)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setQuestionText(questionToEdit?.question ?? '')
      setImageDescription(questionToEdit?.imageDescription ?? '')
      setPreviewUrl(questionToEdit?.pathImage ?? null)
      setSelectedFile(null)
    }
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (questionToEdit) {
        await questionsApi.update(questionToEdit.id, {
          question: questionText.trim(),
          imageDescription: imageDescription.trim() || null,
          image: selectedFile,
          pathImage: previewUrl ? previewUrl : null,
        })
      } else {
        await questionsApi.create({
          topicId,
          question: questionText.trim(),
          imageDescription: imageDescription.trim() || null,
          image: selectedFile,
        })
      }
    },
    onSuccess: () => {
      toast.success(questionToEdit ? 'Soal berhasil diperbarui.' : 'Soal berhasil ditambahkan.')
      onSaved()
      onClose()
    },
    onError: (err) => toast.error(err.message || 'Gagal menyimpan soal.'),
  })

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  function removeImage() {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!questionText.trim()) {
      toast.error('Konten pertanyaan wajib diisi.')
      return
    }
    saveMutation.mutate()
  }

  return (
    <Modal
      isOpen={isOpen}
      title={questionToEdit ? 'Edit Butir Soal' : 'Tambah Soal Baru'}
      onClose={onClose}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question Textarea */}
        <div className="space-y-1.5">
          <label
            htmlFor="q-text"
            className="text-xs font-semibold text-neutral-800 uppercase tracking-wide"
          >
            Pertanyaan / Soal <span className="text-neutral-900">*</span>
          </label>
          <textarea
            id="q-text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Tuliskan butir pertanyaan secara jelas..."
            rows={4}
            required
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors resize-y"
          />
        </div>

        {/* Image Upload & Preview */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wide block">
            Gambar Pendukung (Opsional)
          </span>

          {previewUrl ? (
            <div className="relative w-full p-2 border border-neutral-300 rounded-lg bg-neutral-50 flex items-center justify-center">
              <img src={previewUrl} alt="Preview" className="max-h-48 object-contain rounded" />
              <button
                type="button"
                onClick={removeImage}
                aria-label="Hapus gambar"
                className="absolute top-2 right-2 p-1 bg-white border border-neutral-300 rounded-md text-neutral-600 hover:text-neutral-950 transition-colors shadow-sm cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-neutral-300 rounded-lg hover:border-neutral-900 bg-neutral-50 cursor-pointer transition-colors">
              <ImageIcon size={24} className="text-neutral-400" />
              <div className="text-center">
                <span className="text-xs font-semibold text-neutral-900">Pilih berkas gambar</span>
                <p className="text-[11px] text-neutral-500">Format PNG, JPG, GIF hingga 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Image Description */}
        <div className="space-y-1.5">
          <label
            htmlFor="img-desc"
            className="text-xs font-semibold text-neutral-800 uppercase tracking-wide"
          >
            Konteks Gambar (Untuk Panduan AI)
          </label>
          <textarea
            id="img-desc"
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
            placeholder="Berikan keterangan konteks diagram atau gambar agar AI dapat mengevaluasi dengan akurat..."
            rows={2}
            className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors resize-y"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Spinner size="sm" className="border-t-white" /> : null}
            <span>Simpan Soal</span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}
