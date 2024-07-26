document.addEventListener('DOMContentLoaded', () => {
    const divElements = document.querySelectorAll<HTMLDivElement>('.df');
    const maps = document.querySelectorAll<HTMLDivElement>('.maps');
    divElements.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('gl')) {
                changeMap(maps, "gl");
            }
            else if (this.classList.contains('ed')) {
                changeMap(maps, "ed");
            }
            else {
                changeMap(maps, "ny")
            }
        })
    })
})

const changeMap = (maps: NodeListOf<HTMLDivElement>, clsShouldBeActive: string) => {
    maps.forEach(map => {
        if (map.classList.contains('active')){
            map.classList.remove('active');
        }
        if (map.classList.contains(clsShouldBeActive)) {
            map.classList.add('active');
        } 
    })
}