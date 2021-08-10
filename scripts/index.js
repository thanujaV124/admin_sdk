// DOM elements
const notificationList = document.querySelector('#notifications-list');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const admincontent = document.querySelectorAll('.admin');
const accountDetails = document.querySelector('.account-details');



//set up ui
const setupUI = (user) => {
    if (user) {
        if (user.admin) {

            admincontent.forEach(item => item.style.display = 'block');
            const html = `
            <div>Email: ${user.email}</div><br>
            <div class="red-text">admin: ${user.admin}</div><br>

            `;

            accountDetails.innerHTML += html;

        }


        // toggle user UI elements
        // notificationTitle.style.display = 'block';

        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');

    } else {
        // toggle user elements

        // notificationTitle.style.display = 'none';
        loggedInLinks.forEach(item => item.style.display = 'none');
        admincontent.forEach(item => item.style.display = 'none');

        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}

//setup notifications
function rendernotifcation(doc){
        

        
    const notification = doc.data();

    let  li = document.createElement('li');
    let  div = document.createElement('div');
    let  name = document.createElement('strong');
    let designation = document.createElement('span');
    let date = document.createElement('span')
    let divColabsiblebody = document.createElement('div');
    let title = document.createElement('strong');
    let br = document.createElement('br');
    let desc = document.createElement('p');
    let delBtn = document.createElement('button');


    li.setAttribute('data-id', doc.id);
    div.className = 'collapsible-header';
    designation.style.marginLeft = '5px';
    date.className = 'badge';
    delBtn.className = 'btn red darken-2';
    delBtn.id = 'delBtn';
    divColabsiblebody.className = 'collapsible-body';
    name.textContent = notification.fullName;
    designation.textContent = notification.position;
    date.textContent = formatDate(notification.createdAt);
    title.textContent = notification.title;
    desc.textContent = notification.description;
    delBtn.innerHTML = 'DELETE';

    



    li.appendChild(div);
    div.appendChild(name);
    div.appendChild(designation);
    div.appendChild(date);
    li.appendChild(divColabsiblebody);
    divColabsiblebody.appendChild(title);
    divColabsiblebody.appendChild(br);
    divColabsiblebody.appendChild(desc);
    divColabsiblebody.appendChild(delBtn);
    notificationList.appendChild(li);
    
  
    




delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.parentElement.getAttribute('data-id');
    db.collection('notifications').doc(id).delete().then(() => {
        M.toast({html: 'Notification was deleted'});
    });
});

}
   








// set materialize components
document.addEventListener('DOMContentLoaded', function () {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);




});


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('/');
}


