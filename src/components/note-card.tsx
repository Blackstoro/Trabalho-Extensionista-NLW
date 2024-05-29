import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
    translatedContent?: string;
  };
  onNoteDeleted: (id: string) => void;
  onTranslate: (id: string, targetLang: string) => void;
}

function decodeHTMLEntities(text: string): string {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

export function NoteCard({ note, onNoteDeleted, onTranslate }: NoteCardProps) {
  const handleTranslate = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onTranslate(note.id, event.target.value);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 space-y-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
        </span>
        <div className="flex-1 overflow-y-auto">
          <p className="text-sm leading-6 text-slate-400 whitespace-pre-wrap">
            {note.content}
          </p>
          {note.translatedContent && (
            <p className="text-sm leading-6 text-slate-400 mt-2 whitespace-pre-wrap">
              <strong>Traduzido:</strong> {decodeHTMLEntities(note.translatedContent)}
            </p>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <div className="flex flex-1 flex-col gap-3 p-5 overflow-y-auto">
            <span className="text-sm font-medium text-slate-300">
              {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
            </span>
            <p className="text-sm leading-6 text-slate-400 whitespace-pre-wrap">
              {note.content}
            </p>
            {note.translatedContent && (
              <p className="text-sm leading-6 text-slate-400 mt-2 whitespace-pre-wrap">
                <strong>Traduzido:</strong> {decodeHTMLEntities(note.translatedContent)}
              </p>
            )}
          </div>
          <div className="flex flex-col p-5 gap-3">
            <select
              onChange={handleTranslate}
              className="bg-slate-800 text-slate-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-lime-400"
              defaultValue=""
            >
              <option value="" disabled>Selecione o idioma da tradução</option>
              <option value="en">Inglês</option>
              <option value="de">Alemão</option>
              <option value="fr">Francês</option>
              <option value="es">Espanhol</option>
              <option value="it">Italiano</option>
            </select>
            <button
              type="button"
              onClick={() => onNoteDeleted(note.id)}
              className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
            >
              Deseja <span className="text-red-400 group-hover:underline">apagar esta nota</span>?
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
