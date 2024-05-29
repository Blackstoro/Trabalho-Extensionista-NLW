import { ChangeEvent, useState } from 'react';
import logo from './assets/fsg.png';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';
import axios from 'axios';

interface Note {
  id: string;
  date: Date;
  content: string;
  translatedContent?: string;
}

export function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray); 

    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => note.id !== id);

    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearch(query);
  }

  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes;

  async function handleTranslate(noteId: string, targetLang: string) {
    const noteToTranslate = notes.find(note => note.id === noteId);
    if (!noteToTranslate) return;

    try {
      const response = await axios.post(`https://translation.googleapis.com/language/translate/v2`, null, {
        params: {
          q: noteToTranslate.content,
          target: targetLang,
          key: 'SUA_CHAVE_API'
        }
      });

      const translatedText = response.data.data.translations[0].translatedText;

      const updatedNotes = notes.map(note =>
        note.id === noteId ? { ...note, translatedContent: translatedText } : note
      );

      setNotes(updatedNotes);

      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Translation failed:', error);
    }
  }
  
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0">
      { <img src={logo} alt="FSG Logo" />  }

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas conversas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map(note => {
          return (
            <NoteCard
              key={note.id}
              note={note}
              onNoteDeleted={onNoteDeleted}
              onTranslate={handleTranslate}
            />
          );
        })}
      </div>
    </div>
  );
}
