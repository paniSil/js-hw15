const moviesListElement = document.getElementById('movie-list')
const searchInput = document.getElementById('search')
const searchCheckbox = document.getElementById('checkbox')

const APIKEY = '56717536';

let lastSearchQuery = null;
let isSearchCheckboxChecked = false;

const debounce = (() => {
    let timer = null;
    return (cb, ms) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        timer = setTimeout(cb, ms);
    }
})()

const addMoviesToList = ({ Poster: poster, Title: title, Year: year }) => {
    const item = document.createElement('div');
    const img = document.createElement('img');

    item.classList.add('movie');

    img.classList.add('movie__image');
    img.src = /^(https?:\/\/)/i.test(poster) ? poster : 'src/no-image.svg';
    img.alt = `${title} (${year})`;
    img.title = `${title} (${year})`;

    item.append(img);
    moviesListElement.append(item);
}

const clearMovieList = () => {
    if (moviesListElement) {
        moviesListElement.innerHTML = '';
    }
}

const getData = (url) =>
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if (!data || !data.Search) {
                throw new Error('Incorrect data');
            }
            return data.Search;
        })

const SearchInputHandler = (e) => {
    debounce(() => {
        const searchQuery = e.target.value.trim()

        if (!searchQuery || searchQuery.length < 4 || searchQuery === lastSearchQuery) return;
        if (!isSearchCheckboxChecked) {
            clearMovieList();
        }

        lastSearchQuery = searchQuery;

        getData(`http://www.omdbapi.com/?s=${searchQuery}&apikey=${APIKEY}`)
            .then((data) => data.forEach(addMoviesToList))
            .then((err) => console.log(err))
    }, 2000)

}

searchInput.addEventListener('input', SearchInputHandler)
searchCheckbox.addEventListener('change', (e) => (isSearchCheckboxChecked = e.target.checked))