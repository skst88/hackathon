let currentPage = 1
const API = `http://localhost:8000/posts?_page=${currentPage}&_limit=100000`

const SECOND_API = "  http://localhost:8000/posts"
let contactName = $('#contact-name')
let contactSurname = $('#contact-surname')
let contactLogin = $('#contact-login')
let contactStatus = $('#contact-status')
let btnSave = $('.btn-save')
let modal = $('.modal')

//! Create
async function addProduct() {
    let name = contactName.val();
    let surname = contactSurname.val()
    let login = contactLogin.val()
    let status = contactStatus.val()
    let product = {
        name,
        surname,
        login,
        status,
    }
    try {
        const response = await axios.post(API, product)
        console.log(response)
        Toastify({
            text: response.statusText,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "lightblue",
            }
        }).showToast();
        modal.modal("hide")
        render(API)
    } catch (e) {
        Toastify({
            text: e.response.statusText,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "red",
            }
        }).showToast();
    }
}

btnSave.on('click', addProduct)

// ! Read 

let list = $('.cartochki')

async function render(url) {
    try {
        const response = await axios(url)
        console.log(response.headers.link)
        list.html("")
        console.log(response.data)
        response.data.forEach((item, index) => {
            list.append(`
           
            <div class="card mt-3 mb-3" style="width: 50rem; " >
                         <div class="moveBtn " style="display:flex; justify-content: space-between">
                            <button style="background-color:pink" id=${item.id} type="button" class="btn edit-btn " data-bs-toggle="modal" data-bs-target="#edit">Change</button>
    <button style="background-color:pink" id=${item.id} type="button" class="btn  delete-btn" data-bs-target="#editModal">Delete</button>
                         </div>

  <img style="width:100%; object-fit: contain; height: 190px;" src="http://cdn.onlinewebfonts.com/svg/download_357118.png" class="card-img-top" alt="..." >
  <div class="card-body" style="background-color: #fff" >
    <h5 class="card-title">${item.name}</h5>
    <p class="card-text">${item.surname}</p>
    <p class="card-phone">${item.status}</p>
    <a href="#" ">${item.login}</a><br />
      <div class="input-group mb-3">
  <input type="text" class="form-control input" placeholder="Оставьте комментарий " aria-label="Recipient's username" aria-describedby="button-addon2">
  <button class="sub">Отправить</button>
  
</div>
<h3 class="h3" id="h3-${index}"></h3>
    
  </div>
</div>


            `)
        })
        $('.sub').click(function (e) {

            console.log(e.target)
            $('.h3').append(` ${$('.input').val()}`)
        })


    } catch (e) {
        console.log(e)
    }
}

render(API)



// ! Search 

let searchInp = $('.inp-search')
searchInp.on('input', (e) => {
    let value = e.target.value
    let url = `${API}&q=${value}`
    render(url)
})

// ! Update
let contactNameEdit = $('#contact-name-edit')
let contactSurnameEdit = $('#contact-surname-edit')
let contactLoginEdit = $('#contact-login-edit')
let contactStatusEdit = $('#contact-status-edit')
let btnSaveEdit = $('.btn-save-edit')


$(document).on('click', ".edit-btn", async (e) => {
    let id = e.target.id
    try {
        const response = await axios(`${SECOND_API}/${id}`)
        contactNameEdit.val(response.data.name)
        contactSurnameEdit.val(response.data.surname)
        contactLoginEdit.val(response.data.login)
        contactStatusEdit.val(response.data.status)
        btnSaveEdit.attr('id', id)
    } catch (e) {
        console.log(e)
    }
})

btnSaveEdit.on('click', async (e) => {
    let id = e.target.id
    let name = contactNameEdit.val()
    let surname = contactSurnameEdit.val()
    let login = contactLoginEdit.val()
    let status = contactStatusEdit.val()
    let product = {
        name,
        surname,
        login,
        status,
    }
    try {
        await axios.patch(`${SECOND_API}/${id}`, product)
        modal.modal('hide')
        let url = `http://localhost:8000/posts?_page=${currentPage}&_limit=3`
        render(url)
    } catch {
        console.log(e)
    }
})

//  ! DElETE

$(document).on('click', '.delete-btn', async (e) => {
    let id = e.target.id
    await axios.delete(`${SECOND_API}/${id}`)
    render(API)
})
