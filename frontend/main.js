let username = document.querySelector("#username");
let password = document.querySelector("#password");
let booksDiv = document.querySelector(".books");
let landingPage = document.querySelector(".landing-page");
let audioDiv = document.querySelector(".audio-books");
let userBookList = document.querySelector(".user-profile");
let registerUsername = document.querySelector("#register-user");
let registerEmail = document.querySelector("#register-email");
let registerPassword = document.querySelector("#register-password");


const loginPage = () => {
    document.querySelector(".login-field").classList.remove("hidden");
    document.querySelector(".register-field").classList.remove("hidden");
    document.querySelector(".login-register-page").classList.remove("hidden");
    document.querySelector(".landing-page").classList.add("hidden");
}

const ProfilePage = () => {
    document.querySelector(".add-new-book-page").classList.add("hidden");
    document.querySelector(".user-profile").classList.remove("hidden");
    document.querySelector(".add-book-btn").classList.remove("hidden");
    document.querySelector(".loggedin-user-info").classList.remove("hidden");
    document.querySelector(".landing-page").classList.add("hidden");

    loggedInUser()
    userBooks()
    userAudio()
}


const login = async () => {
    let response = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: username.value,
        password: password.value
    });

    console.log(response);
    let token = response.data.jwt;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("id", response.data.user.id);
    sessionStorage.setItem("name", response.data.user.username);

    document.querySelector(".login-user").innerHTML = `${username.value}`
    document.querySelector(".login-register-page").classList.add("hidden"); 
    document.querySelector(".login-page-btn").classList.add("hidden"); 
    document.querySelector(".logout").classList.remove("hidden"); 
    document.querySelector(".login-user").classList.remove("hidden"); 
    document.querySelector(".add-book-btn").classList.remove("hidden"); 
    document.querySelector(".fa-user-alt").classList.remove("hide");
    
    loggedInUser()
    userBooks()
    userAudio()
}


const loggedInUser = async () => {

    document.querySelector(".loggedin-user-info").innerHTML = "";

    userData("http://localhost:1337/api/users/me")
    .then(response => {

        let {username, email, id, createdAt} = response.data
        let userInfo = document.querySelector(".loggedin-user-info")
    
        userInfo.innerHTML += `
        <p><i>Användarnamn:</i> ${username}</p>
        <p><i>Email:</i> ${email}</p>
        <p><i>Id:</i> ${id}</p>
        <p><i>Skapad:</i> ${createdAt.slice(0, 10)}</p>
        `
    });
}


const userBooks = async() => {
    document.querySelector(".user-books").innerHTML = "";
    document.querySelector(".user-profile").classList.remove("hidden");

    userData("http://localhost:1337/api/books?populate=*")
    .then(data => {data.data.data.forEach(book => {
        if(book.attributes.userId == sessionStorage.getItem("id")) {
            console.log(book)
    
            let {title} = book.attributes;
            let {url} = book.attributes.image.data[0].attributes;
        
            document.querySelector(".user-books").innerHTML += `
                <div>
                    <br>
                    <img src="http://localhost:1337${url}" height="150" width="100">
                    <h3>${title}</h3>
                </div>
                `
        }
    })})
}

const userAudio = async() => {
    document.querySelector(".user-audio").innerHTML = "";

    userData("http://localhost:1337/api/audio-Books?populate=*")
    .then(data => {data.data.data.forEach(book => {
        if(book.attributes.userId == sessionStorage.getItem("id")) {
            console.log(book)
    
            let {title} = book.attributes;
            let {url} = book.attributes.image.data[0].attributes;
        
            document.querySelector(".user-audio").innerHTML += `
                <div>
                    <br>
                    <img src="http://localhost:1337${url}" height="150" width="100">
                    <h3>${title}</h3>
                </div>
                `
        }
    })})
}

const register = async () => {
    let response = await axios.post("http://localhost:1337/api/auth/local/register", {
        username: registerUsername.value,
        password: registerPassword.value,
        email: registerEmail.value
    })

    let token = response.data.jwt;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("id", response.data.user.id);
    sessionStorage.setItem("name", response.data.user.username);

    document.querySelector(".login-user").innerHTML = `${registerUsername.value}`
    document.querySelector(".login-register-page").classList.add("hidden");
    document.querySelector(".login-page-btn").classList.add("hidden"); 
    document.querySelector(".logout").classList.remove("hidden"); 
    document.querySelector(".login-user").classList.remove("hidden"); 
    document.querySelector(".add-book-btn").classList.remove("hidden"); 
    document.querySelector(".fa-user-alt").classList.remove("hide");
    
    loggedInUser()
    userBooks()
}


const renderBooks = async () => {
    booksDiv.innerHTML = "";
    let response = await axios.get("http://localhost:1337/api/books?populate=*")

    let books = response.data.data;
    console.log(`renderBooks:`)
    console.log(books)

    books.forEach(book => {
        let {title, author, pages, grade} = book.attributes;
        let {url} = book.attributes.image.data[0].attributes;
        let {username, email} = book.attributes.user.data.attributes;
        
        let genres = book.attributes.genres.data;

        let genreType = [];

        genres.forEach(bookGenre => {

            genreType.push(bookGenre.attributes.genre);

        })
        console.log(genreType)

        booksDiv.innerHTML += `
        <div>
            <h3>${title}</h3>
            <img src="http://localhost:1337${url}" height="150" width="100">
            <p><strong>Författare:</strong> ${author}</p>
            <p><strong>Sidor:</strong> ${pages}</p>
            <p><strong>Betyg:</strong> ${grade}/10</p>
            <p><strong>Genre:</strong> ${genreType}</p>
            <br>
            <i>Utlånad av</i>
            <p><strong>Användarnamn:</strong> ${username}</p>
            <p><strong>Email:</strong> ${email}</p>
        </div>
        `

        let createdBy = book.attributes.user.data.attributes.username;
        console.log(createdBy)

    });

    let loggedInUser = sessionStorage.getItem("token");

    if(loggedInUser){
        document.querySelector(".add-book-btn").classList.remove("hidden");
        document.querySelector(".login-page-btn").classList.add("hidden");
        document.querySelector(".logout").classList.remove("hidden");
        document.querySelector(".login-user").classList.remove("hidden");
        document.querySelector(".landing-page").classList.remove("hidden");
        document.querySelector(".fa-user-alt").classList.remove("hide");
        document.querySelector(".login-user").innerHTML = `${sessionStorage.getItem("name")}`
    }

}



let userData = async (url) => {
    let response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    })
    return response
}



const renderAudio = async () => {
    audioDiv.innerHTML = "";
    let response = await axios.get("http://localhost:1337/api/audio-Books?populate=*")

    let audios = response.data.data;
    console.log(`renderBooks:`)
    console.log(audios)

    audios.forEach(audio => {
        let {title, date, length, grade} = audio.attributes;
        let {url} = audio.attributes.image.data[0].attributes;
        let {username, email} = audio.attributes.user.data.attributes;
        
        let genres = audio.attributes.genres.data;

        let genreType = [];

        genres.forEach(bookGenre => {

            genreType.push(bookGenre.attributes.genre);

        })
        console.log(title)

        audioDiv.innerHTML += `
        <div>
            <h3>${title}</h3>
            <img src="http://localhost:1337${url}" height="150" width="100">
            <p><strong>Utgivningsdatum:</strong> ${date}</p>
            <p><strong>Längd:</strong> ${length} minuter</p>
            <p><strong>Betyg:</strong> ${grade}/10</p>
            <p><strong>Genre:</strong> ${genreType}</p>
            <br>
            <i>Utlånad av</i>
            <p><strong>Användarnamn:</strong> ${username}</p>
            <p><strong>Email:</strong> ${email}</p>
        </div>
        `

        let createdBy = audio.attributes.user.data.attributes.username;
        console.log(createdBy)

    });

    let loggedInUser = sessionStorage.getItem("token");

    if(loggedInUser){
        document.querySelector(".add-book-btn").classList.remove("hidden");
        document.querySelector(".login-page-btn").classList.add("hidden");
        document.querySelector(".logout").classList.remove("hidden");
        document.querySelector(".login-user").classList.remove("hidden");
        document.querySelector(".landing-page").classList.remove("hidden");
        document.querySelector(".fa-user-alt").classList.remove("hide");
        document.querySelector(".login-user").innerHTML = `${sessionStorage.getItem("name")}`
    }

}


let addBookPage = () => {
    document.querySelector(".landing-page").classList.add("hidden");
    document.querySelector(".add-new-book-page").classList.remove("hidden");
    document.querySelector(".add-new-audio").classList.remove("hidden");
    document.querySelector(".user-profile").classList.add("hidden"); 
    document.querySelector(".add-book-btn").classList.add("hidden"); 
    document.querySelector(".loggedin-user-info").classList.add("hidden"); 
}


let addBook = async () => {
    let title = document.querySelector("#title").value;
    let author = document.querySelector("#author").value;
    let pages = document.querySelector("#page-number").value;
    let grade = document.querySelector("#grade").value;
    let genres = Array.from(document.querySelector("#genre").selectedOptions);
    let image = document.querySelector("#book-image").files;
    
    genreType = [];

    genres.forEach(option => {
        genreType.push(option.value);
    })

    let imgData = new FormData();
    imgData.append('files', image[0]);

    let userData = await axios.get("http://localhost:1337/api/users/me",
    {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    }).then(data => {
        return userId = data.data.id
    })

    axios.post("http://localhost:1337/api/upload", imgData, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    }).then(x => {
        let imageId = x.data[0].id;
        let userId = sessionStorage.getItem("id");
        axios.post("http://localhost:1337/api/books?populate=*", {
            data : {
                title,
                author,
                pages,
                grade,
                image: imageId,
                userId,
                user:[userId],
                genres:genreType
            }
        }, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })

        ProfilePage();
    })
}


let addAudio = async () => {
    let title = document.querySelector("#audio-title").value;
    let date = document.querySelector("#date").value;
    let length = document.querySelector("#length").value;
    let grade = document.querySelector("#audio-grade").value;
    let genres = Array.from(document.querySelector("#audio-genre").selectedOptions);
    let image = document.querySelector("#audio-image").files;
    
    genreType = [];

    genres.forEach(option => {
        genreType.push(option.value);
    })

    let imgData = new FormData();
    imgData.append('files', image[0]);

    await axios.get("http://localhost:1337/api/users/me",
    {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    }).then(data => {
        return userId = data.data.id
    })

    axios.post("http://localhost:1337/api/upload", imgData, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    }).then(x => {
        let imageId = x.data[0].id;
        let userId = sessionStorage.getItem("id");
        axios.post("http://localhost:1337/api/audio-Books?populate=*", {
            data : {
                title,
                date,
                length,
                grade,
                image: imageId,
                userId,
                user:[userId],
                genres:genreType
            }
        }, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })

        ProfilePage();
    })
}


const logOut = () => {
    sessionStorage.clear()
    window.location.reload()
}

renderBooks();
renderAudio();
