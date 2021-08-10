

//listen to auth changes
auth.onAuthStateChanged(user => {

    if (user) {
        
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;

            setupUI(user);
            if(user.admin){

                db.collection('notifications').orderBy('createdAt').onSnapshot(snapshot => {
                    let changes = snapshot.docChanges();

                    changes.forEach(change => {
                        if(change.type == 'added'){
                            
                            rendernotifcation(change.doc);
                            
                        } else if(change.type == 'removed'){
                            let li = notificationList.querySelector('[data-id='+ change.doc.id +']');
                            notificationList.removeChild(li);
                        }
                    })
                });
            } else {
                auth.signOut();
    location.reload();

            }
        });
        //get data
    } else {
        console.log('user logged out');
        setupUI();
        setupGuides([]);

    }
});






//create new notifications
const addNotificationForm = document.querySelector('#create-notification');
addNotificationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const avatarIndex = Math.floor(Math.random() * 8)
    // console.log(avatar);
    db.collection('assets').doc('avatars').onSnapshot(snapshot => {
        avatarUrl = snapshot.data()['teachers'][avatarIndex];
        
        db.collection('notifications').add({
            fullName: addNotificationForm['fullName'].value,
            position: addNotificationForm['designation'].value,
            title: addNotificationForm['title'].value,
            description: addNotificationForm['description'].value,
            createdAt:new Date().toISOString(),
            avatar: avatarUrl
        }, err => console.log(err)).then(() =>{ 
            console.log('data added');
    
            //close the create modal & reset form
            const modal = document.querySelector('#modal-notification');
            M.Modal.getInstance(modal).close();
            addNotificationForm.reset();
        });
    })
});



//add subjects
const subjectForm = document.querySelector('#create-subject');
subjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var selectBranch = document.querySelector('#select-branch').selectedIndex;
    var selectsem = document.querySelector('#select-sem').selectedIndex;
    const branch = document.querySelectorAll('#option-branch')[selectBranch - 1].value;
    const sem = document.querySelectorAll('#option-sem')[selectsem - 1].value;
     
    
    db.collection('branch').doc(branch.toLowerCase()).collection(sem.toLowerCase()).add({
        id: subjectForm['subject-code'].value.toLowerCase(),
        name: subjectForm['subject-name'].value.toLowerCase(),
        description: subjectForm['description'].value,
        modules: [],
        notes: []

    }, err => console.log(err)).then((value) => {
        console.log(value.id);
          //close the create modal & reset form
          const modal = document.querySelector('#modal-subject');
          M.Modal.getInstance(modal).close();
          subjectForm.reset();
    })

});

// add usn
const usnForm = document.querySelector('#create-usn');
usnForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const error = document.querySelector('.error-usn');

    var usn = usnForm['usn'].value;
    var validate = usn.toLowerCase().toString().match("[a-zA-Z]{1}[0-9]{7}")
    if(validate){
        db.collection('usncollection').doc('usncollection').set({
            [usn.toLowerCase()]: false,
        },{merge:true}, err => console.log(err)).then(() => {
             //close the create modal & reset form
         const modal = document.querySelector('#modal-usn');
         M.Modal.getInstance(modal).close();
         usnForm.reset();
        error.innerHTML = '';
        });
        
    } else {

        error.classList.add('red-text');
        error.innerHTML = 'usn invalid';
    }
    
})

//sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user details
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {


        //close modal
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    });
});

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    window.location.reload();


});

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // login the user in 
    auth.signInWithEmailAndPassword(email, password).then((cred) => {

        //close the signup modal and reset the form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })
})