document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll<HTMLInputElement>('input');
    inputs?.forEach(input => {
        const label = input.nextElementSibling as HTMLLabelElement;
        input.addEventListener('change', function() {
            if (this.value.trim() !== '') {
                this.classList.add('not-empty');
                label.classList.add('not-empty');
            }
            else {
                this.classList.remove('not-empty');
                label.classList.remove('not-empty');
            }
        })
    });

    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    const textareaLabel = textarea.nextElementSibling as HTMLLabelElement;
    textarea.addEventListener('change', function() {
        if (this.value.trim() !== '') {
            this.classList.add('not-empty');
            textareaLabel.classList.add('not-empty');
        }
        else {
            this.classList.remove('not-empty');
            textareaLabel.classList.remove('not-empty');           
        }
    })
})