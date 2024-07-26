export const changeStyle = (...elements: HTMLElement[]): void => {
    elements.forEach(element => {
        const currentDisplay = getComputedStyle(element).display;
        if (currentDisplay === 'none') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    })
}

export const insertSound = (sound: string, author: string, mp3ref: string): void => {
    const myCode: string = `
    <div class="music fcont">
    <div class="left-part-music">
            <div class="author-image">
                    <img src="" alt="">
                    <h2 class="name-author">
                            ${sound}
                    </h2>
            </div>
            <div class="name-music">
                    <h3>${author}</h3>
            </div>
    </div>
    <div class="right-part-music">
            <div class="play_controls">
                    <div class='triangle-play'></div>
                    <audio class="audio" controls='true' preload='none' hidden>
                            <source src=${mp3ref} type="audio/mpeg">
                    </audio>
            </div>
                <button class="download" title="download" data-url=${mp3ref} data-name=${sound}>Download</button>
        </div>
    </div>
    `;

    const contentDiv: HTMLElement | null = document.getElementById('content');

    if (contentDiv) {
            const newDiv = document.createElement('div');
            newDiv.innerHTML = myCode; 
            contentDiv.insertAdjacentElement('beforeend', newDiv);
    } else {
            console.error('Element with id "content" not found');
    }
}

export interface Dictionary {
        [key: string]: string[];
}

export const sortValuesByPosition = (dict: Dictionary): Array<Array<string>> => {
        let result = [];
        let keys = Object.keys(dict);


        for (let i = 0; i < dict['sounds'].length; i++) {
                let resArray: any[] = [];

                keys.forEach(key => {
                        resArray.push(dict[key][i]);
                });

                result.push(resArray);
        }

        return result;
}