const mainSectionH2 = document.querySelector('.main-section h2');
const filmContainer = document.querySelector('.film-container');
const searchBtn = document.querySelector('.search-btn');
const searchKeyword = document.querySelector('.search-field');
const sugestionContainer = document.querySelector('.sugestion');
const errorMessage = document.querySelector('.error');
const startMessage = document.querySelector('.start');
const loader = document.querySelector('.loader');


//membuat rekomendasi film pilihan
searchKeyword.addEventListener('keyup',()=>{ 
        fetch('https://www.omdbapi.com/?apikey=8c3a26e3&&s='+ searchKeyword.value)
        .then(response => response.json())
        .then(response =>{
            const movie = response.Search;
            sugestionContainer.innerHTML = null;
            startMessage.style.display = 'none';
            movie.forEach(m => {
               
                const sugestion = document.createElement('div');
                    sugestion.classList.add('search-sugestion');

                const sugestionTitle = ` <h4 class="title" data-imdbid ="${m.imdbID}">${m.Title}</h4>`;
                sugestion.innerHTML = sugestionTitle;
                sugestionContainer.prepend(sugestion);
            })
            const sugestionTitle = document.querySelectorAll('.search-sugestion h4');
            sugestionTitle.forEach(title =>{
                title.addEventListener('click', function(){
                    const imdbid = this.dataset.imdbid;
                    makeMovieDetail(imdbid);
                })
            })
        })
        .catch(err =>{
            const sugestion = document.createElement('div');
            sugestion.classList.add('search-sugestion');
            const sugestionTitle = `<h4>film not found</h4>`;
                sugestion.innerHTML = sugestionTitle;
                sugestionContainer.prepend(sugestion);          
        })
})

//mencari film 
searchBtn.addEventListener('click', (event)=>{
   fetchMovie();
});

//mencari film dengan parameter di kolom pencarian
function fetchMovie(){
    loader.style.display = 'block';
    sugestionContainer.innerHTML = null;
    filmContainer.innerHTML = null;  
    fetch('https://www.omdbapi.com/?apikey=8c3a26e3&&s=' + searchKeyword.value)
    .then(response => response.json())
    .then(response => {
        errorMessage.style.display = 'none';
        const movie = response.Search;
        movieTotal(movie, searchKeyword.value);

        movie.forEach(m =>{
        const filmCard = document.createElement('div');
            filmCard.classList.add('film-card');
                filmCard.innerHTML = makeFilmCards(m);
                filmContainer.appendChild(filmCard);
            }) 
        const filmPoster = document.querySelectorAll('.film-poster');
        filmPoster.forEach(card =>{
            card.addEventListener('click',function(){
               const imdbid = this.dataset.imdbid;

               makeMovieDetail(imdbid);
            })
        //membuat animasi pada kartu film
        const movieCards = document.querySelectorAll('.film-poster');
        const filmDetail = document.querySelectorAll('.film-detail');
            for(let i = 0; i < movieCards.length; i++){
                movieCards[i].addEventListener('mouseenter', ()=>{
                    filmDetail[i].style.top = '-100px';
                    filmDetail[i].style.opacity = '1';
                })
                movieCards[i].addEventListener('mouseleave', ()=>{
                    filmDetail[i].style.top = '-95px';
                    filmDetail[i].style.opacity = '0';
                })
            }
        })
        loader.style.display = 'none';
    })
    .catch(err =>{
        if(searchKeyword.value.length == 0) ()=>{
            startMessage.style.display ='block';
            loader.style.display = 'none';
            errorMessage.style.display = 'none';
        }
        mainSectionH2.style.display = 'none';
    })
}
//membuat kartu film
function makeFilmCards(m){
    return`<div class="film-poster" data-imdbid ="${m.imdbID}">
                <img src="${m.Poster}">
            </div> 
            <div class="film-detail">
                <h1>${m.Title}</h1>
                <p>${m.Year}</p>
            </div>`
}


//membuat jumlah film
function movieTotal(x,y){
    mainSectionH2.style.display = 'none';
    mainSectionH2.innerHTML = `showing search results for : ${y} (${x.length} results)`
    mainSectionH2.style.display = 'block';  
}


//membuat detail film saat kartu film di klik
const detailContainer = document.querySelector('.movie-detail-container');

function makeMovieDetail(imdbId){
    loader.style.display = 'block';
    detailContainer.innerHTML = null;
    fetch('https://www.omdbapi.com/?apikey=8c3a26e3&&i=' + imdbId)
    .then(response => response.json())
    .then(response =>{
        errorMessage.style.display = 'none';
        filmContainer.innerHTML = null;
        sugestionContainer.innerHTML = null;
        mainSectionH2.innerHTML = null; 
        detailContainer.style.display ='block'

        const movieDetail = ` <span class=" menu-back"><i class="fas fa-arrow-left"></i></span>
                            <div class="movie-detail detail-poster">
                                <img src="${response.Poster}">
                            </div>
                            <div>
                                <div class="movie-detail"><strong>Title : </strong><h3> ${response.Title}</h3></div>
                                <div class="movie-detail"><strong>Year : </strong><p> ${response.Year}</p></div>
                                <div class="movie-detail"><strong>Actors : </strong><p> ${response.Actors}</p></div>
                                <div class="movie-detail"><strong>Writer : </strong><p> ${response.Writer}</p></div>
                                <div class="movie-detail"><strong>Genre : </strong><p> ${response.Genre}</p></div>
                                <div class="movie-detail plot"><strong>Plot : </strong><p> ${response.Plot}</p></div>
                            </div>
                        </div>`
        detailContainer.innerHTML = movieDetail;
        const menuBack = document.querySelector('.menu-back');
        menuBack.addEventListener('click',()=>{
            detailContainer.style.display ='none';
            fetchMovie();
        })
        loader.style.display = 'none';
    })
    .catch(err =>{
        errorMessage.style.display = 'block';
        if(searchKeyword.value.length == 0) return startMessage.style.display ='block';
        loader.style.display = 'none';
        mainSectionH2.style.display = 'none';
    })
}
