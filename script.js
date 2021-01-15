const searchBar = document.querySelector('.searchBar');
const promptContainer = document.querySelector('.promptContainer');
const savedContainer = document.querySelector('.savedContainer');
let fragment = document.createDocumentFragment();
searchBar.addEventListener('input', debounce(async (e) => {
    promptContainer.innerHTML = '';
    if (e.target.value === '') return
    let response = await async function() {
        let res = await fetch(`https://api.github.com/search/repositories?q=${e.target.value}&sort=stars&order=desc`);
        return res.json()
    }();
    response.items.slice(0, 5).forEach(item => {
        let divForRepository = createRepositoryCard(item.name, item.owner.login, item.stargazers_count);
        divForRepository.classList.add('prompt');
        divForRepository.addEventListener('click', () => {
            promptContainer.innerHTML = '';
            e.target.value = '';
            divForRepository.classList.remove('prompt');
            divForRepository.classList.add('saved');
            savedContainer.appendChild(divForRepository);
        })
        fragment.appendChild(divForRepository);
    });
    promptContainer.appendChild(fragment);
}, 500));

const createRepositoryCard = (name, owner, stars) => {
    let div = document.createElement('div');
    let pForName = document.createElement('p');
    pForName.textContent = `name: ${name}`;
    let pForOwner = document.createElement('p');
    pForOwner.textContent = `created by ${owner}.`;
    let pForStars = document.createElement('p');
    pForStars.textContent = `★ ${stars}.`;
    let buttonForDelete = document.createElement('button');
    buttonForDelete.textContent = `X`;
    buttonForDelete.addEventListener('click', (e) => {
        e.target.parentNode.remove()
        e.stopPropagation()
    });
    div.appendChild(pForName);
    div.appendChild(pForOwner);
    div.appendChild(pForStars);
    div.appendChild(buttonForDelete);
    return div
};
function debounce(func, wait) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const fnCall = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, wait);
  };
};
