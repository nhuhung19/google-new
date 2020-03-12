let newList = []
let userInput = document.getElementById('search')
let callAPI = async() => {
    let apiKey = '615b66dd5eb64e848050e4a9780c2de3'
    let url = `https://newsapi.org/v2/everything?q=vietnam&apiKey=${apiKey}`

    let data = await fetch(url)
    let result = await data.json(); // object
    newList = newList.concat(result.articles)

    console.log("data", data)
    console.log("json", result)
    console.log("articles list", newList)
    searchBySource()
    render(newList)
}


const render = (array) => {
    let htmlArray = array.map((item) => {
        return `
        
        <div class="p-1 rounded my-2" id="news" style="display: flex; border: 1px solid grey;">
            <img style="width: 200px;" 
            src=${item.urlToImage}>
            <div class="ml-2">
                <a href=${item.url}><h2>${item.title}</h2></a>
                <p>${item.description}</p>
                <div>${moment().startOf('hour').fromNow()}</div>
                <div>${item.author}</div>
            </div>
        </div>`
    }).join('')
    document.getElementById('newArea').innerHTML = htmlArray
    document.getElementById('show-num').innerHTML = `Showing ${array.length} of ${array.length}`
}
callAPI()

let pageIndex = 1
const loadMore = async() => {
    pageIndex++
    let searchInput = userInput.value
    let apiKey = '615b66dd5eb64e848050e4a9780c2de3'
    let url = `https://newsapi.org/v2/everything?q=${searchInput}&sortBy=relevancy&page=${pageIndex}&apiKey=${apiKey}`

    let data = await fetch(url)
    let result = await data.json(); // object
    newList = newList.concat(result.articles)

    render(newList)
}

const searchTitle = async() => {
    let searchInput = userInput.value
    let apiKey = '615b66dd5eb64e848050e4a9780c2de3'
    let url = `https://newsapi.org/v2/everything?q=${searchInput}&sortBy=relevancy&apiKey=${apiKey}`

    let data = await fetch(url)
    let result = await data.json();
    newList = result.articles
    render(newList)
}
let categoryList = []
const categoryFilter = async(category) => {
    let apiKey = '615b66dd5eb64e848050e4a9780c2de3'
    let url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`
    let data = await fetch(url)
    let result = await data.json()
    console.log('category resultL', result)
    categoryList = result.articles
    render(categoryList)
}

const searchBySource = () => {
    let sourcesName = newList.map((item) => item.source.name)

    let sourceObject = sourcesName.reduce((total, name) => {
        if (name in total) {
            total[name]++
        } else {
            total[name] = 1
        }
        return total
    }, {})

    let sourceArray = Object.keys(sourceObject)

    let htmlSource = sourceArray.map((item) => `<input id="${item}" type="checkbox" onchange="sourceFilter('${item}')" />${item} (${sourceObject[item]})`).join('')
    document.getElementById('sources-name').innerHTML = htmlSource
}

const sourceFilter = (index) => {
    if (document.getElementById(index).checked == true) {
        let filterSources = newList.filter((item) => item.source.name === index)
        render(filterSources)
    } else {
        render(newList)
    }
}