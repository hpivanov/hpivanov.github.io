(() => {
    const DB_NAME = 'notesDB';
    const DB_VERSION = 1;
    const STORE_NAME = 'notes';

    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const objectStore = db.createObjectStore(STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });

                    objectStore.createIndex('text', 'text', {
                        unique: false
                    });

                    objectStore.createIndex('color', 'color', {
                        unique: false
                    });

                    objectStore.createIndex('is_favorite', 'is_favorite', {
                        unique: false
                    });
                }
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    function getAllNotes() {
        return openDB().then((db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.getAll();

                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        });
    }

    function addNote(note) {
        return openDB().then((db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.add(note);

                request.onsuccess = () => {
                    resolve('Note added successfully!');
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        });
    }

    function updateNote(note) {
        return openDB().then((db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put(note);

                request.onsuccess = () => {
                    resolve('Note updated successfully!');
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        });
    }

    function deleteNote(id) {
        return openDB().then((db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(id);

                request.onsuccess = () => {
                    resolve('Note deleted successfully!');
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        });
    }

    addNote({
        text: window.crypto.randomUUID(),
        color: 'green',
        is_favorite: 0
    });

    getAllNotes().then((res) => {
        console.log(res);

        notesElement.innerHTML = `
            <textarea class="textarea js-textarea"></textarea>
            ${res.map(getNoteHTML).join('')}
        `;
    });

    const notes = [
        {
            text: 'First note',
        },
        {
            text: 'Second note',
        },
        {
            text: 'Third note',
        },
        {
            text: 'Fourth note',
        },
        {
            text: 'Fifth note',
        }
    ];

    const notesElement = document.querySelector('.js-notes');

    notesElement.addEventListener('dblclick', (event) => {
        let element = event.target;

        while (element && element !== notesElement) {
            if (element.classList.contains('js-note')) {
                console.log(element);

                break;
            }

            element = element.parentElement;
        }
    });

    notesElement.addEventListener('click', (event) => {
        let element = event.target;

        while (element && element !== notesElement) {
            if (element.classList.contains('js-action')) {
                const action = element.getAttribute('data-action');
                
                if (action === 'delete') {
                    const noteElement = element.closest('.js-note');
                    const id = Number(noteElement.getAttribute('data-id'));

                    deleteNote(id).then(() => {
                        noteElement.remove();
                    });
                }

                break;
            }

            element = element.parentElement;
        }
    });

    function getNoteHTML({ id, text, color }) {
        return `
            <div class="note js-note" data-id="${id}" style="background: ${color};">
                <div class="text">${text}</div>
                <div class="actions">
                    <button class="action js-action" data-action="delete" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Bin-1--Streamline-Ultimate" height="24" width="24"><desc>Bin 1 Streamline Icon: https://streamlinehq.com</desc><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M1 5h22" stroke-width="1.5"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M14.25 1h-4.5c-0.39782 0 -0.77936 0.15804 -1.06066 0.43934C8.40804 1.72064 8.25 2.10218 8.25 2.5V5h7.5V2.5c0 -0.39782 -0.158 -0.77936 -0.4393 -1.06066C15.0294 1.15804 14.6478 1 14.25 1Z" stroke-width="1.5"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M9.75 17.75v-7.5" stroke-width="1.5"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M14.25 17.75v-7.5" stroke-width="1.5"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M18.86 21.62c-0.0278 0.3758 -0.197 0.7271 -0.4735 0.9832 -0.2764 0.256 -0.6397 0.3978 -1.0165 0.3968H6.63c-0.37683 0.001 -0.74006 -0.1408 -1.01653 -0.3968 -0.27647 -0.2561 -0.44565 -0.6074 -0.47347 -0.9832L3.75 5h16.5l-1.39 16.62Z" stroke-width="1.5"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }
})();