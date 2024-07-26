import { changeStyle, insertSound, Dictionary, sortValuesByPosition } from "./modules";
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
        loadSounds(currentPage);

        document.getElementById('prev')?.addEventListener('click', () => {
            prevPage();
        })
        document.getElementById('next')?.addEventListener('click', () => {
            nextPage();
        })

        // waitForElement('.triangle-play', () => {
        //         const playButtons = document.querySelectorAll('.triangle-play') as NodeListOf<HTMLElement>;

        //         playButtons.forEach((playButton) => {
        //                 if (playButton) {
        //                         playButton.addEventListener('click', () => {
        //                                 if (playButton.classList.contains('triangle-play')) {

        //                                         allStopped(playButtons);
        //                                         playButton.classList.remove('triangle-play');
        //                                         playButton.classList.add('two-line-play');
        //                                 } else {
        //                                         allStopped(playButtons);
        //                                 }
        //                         })
        //                 }
        //         });

        //         const pauseButtons = document.querySelectorAll('.two-line-play') as NodeListOf<HTMLElement>;

        //         pauseButtons.forEach((pauseButton) => {
        //                 if (pauseButton) {
        //                         allStopped(playButtons);
        //                 }
        //         })
        // })

        document.addEventListener('click', (event: MouseEvent) => {
                const target = event.target as HTMLElement;

                if (target.classList.contains('triangle-play')) {
                    const allPlayControls = document.querySelectorAll('.two-line-play');
                    allPlayControls.forEach((control) => {
                        control.classList.remove('two-line-play');
                        control.classList.add('triangle-play');
                        const audio = control.nextElementSibling as HTMLAudioElement;
                        if (audio) {
                            audio.pause();
                            audio.currentTime = 0; 
                        }
                    });

                    const playControl = target;
                    const audio = playControl.nextElementSibling as HTMLAudioElement;
            
                    playControl.classList.remove('triangle-play');
                    playControl.classList.add('two-line-play');
            
                    audio.play();
                } else if (target.classList.contains('two-line-play')) {
                    const playControl = target;
                    const audio = playControl.nextElementSibling as HTMLAudioElement;
            
                    playControl.classList.remove('two-line-play');
                    playControl.classList.add('triangle-play');
            
                    audio.pause();
                }
            });
            
            document.addEventListener('click', function(event) {
                const target = event.target as HTMLElement;
                if (target && target.classList.contains('download')) {
                    const url = target.dataset.url;
                    const name = target.dataset.name;
            
                    if (url) {
                        fetch(url)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok ' + response.statusText);
                                }
                                return response.blob();
                            })
                            .then(blob => {
                                const downloadUrl = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = downloadUrl;
                                link.download = `${name}.mp3` || 'download';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(downloadUrl);
                            })
                            .catch(error => console.error('There was a problem with the fetch operation:', error));
                    } else {
                        console.error('URL is not defined in the data-url attribute');
                    }
                }
            });
            

})

function loadSounds(page: any) {
    fetch(`/api/sounds?page=${page}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка при загрузке: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const content = document.getElementById('content');
        if (data && content) {
            content.innerHTML = '';
            const itemsForSounds = sortValuesByPosition(data);
            console.log(itemsForSounds)
            let acc = 0;
            itemsForSounds.forEach(item => {
                acc += 1;    
                insertSound(item[0], item[1], item[2]);
                const pushFooter = document.getElementById('pushFooter');
                if (pushFooter && acc > 3) {
                    pushFooter.style.marginTop += '150px';
                }
                
            });
            const pageInfoElement = document.getElementById('pageInfo');
            if (pageInfoElement) {
                pageInfoElement.textContent = `Страница ${page}`;
            } else {
                console.error('Element with id "pageInfo" not found');
            }
            const prevButton = document.getElementById('prev') as HTMLButtonElement;
            if (page === 1) {
                if (prevButton) {
                    prevButton.disabled = true;
                }
            } else {
                if (prevButton) {
                    prevButton.disabled = false;
                }
            }
        } else {
            console.error('Данные или элемент content не найдены');
        }
    })
    .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
    });
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadSounds(currentPage);
    }
}

function nextPage() {
    currentPage++;
    loadSounds(currentPage);
}

function allStopped(playButtons: NodeListOf<HTMLElement>) {
        playButtons.forEach((playButton) => {
                if (playButton.classList.contains('two-line-play')) {
                        playButton.classList.remove('two-line-play');
                        playButton.classList.add('triangle-play');
                }
        })
}

function waitForElement(play: any, callback: any) {
        const observer = new MutationObserver((mutations, observer) => {
                if (document.querySelector(play)) {
                callback();
                observer.disconnect(); // Прекращаем наблюдение
                }
        });

        observer.observe(document.body, {
                childList: true, // Наблюдаем за добавлением/удалением дочерних узлов
                subtree: true   // Наблюдаем за всем деревом
        });
}