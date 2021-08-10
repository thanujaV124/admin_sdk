var uploader = document.querySelector('#uploader');
var fileButton = document.querySelector('#fileButton');


const selectOperation = document.querySelector("#select-operation");
const NotesSem = document.querySelector("#select-notes-sem");
const NotesBranch = document.querySelector("#select-notes-branch");
const subjectCode = document.querySelector("#select-subcode");

const moduleInput = document.querySelector("#module-input");
const notesInput = document.querySelector("#notes-input");

const NotesForm = document.querySelector("#create-notes");

selectOperation.addEventListener("change", (e) => {
  var selectedOperation =
    selectOperation.options[selectOperation.selectedIndex].value;
  console.log(selectedOperation);
  NotesBranch.style.display = "block";
  NotesBranch.addEventListener("change", (e) => {
    e.preventDefault();

    NotesSem.style.display = "block";
    selectOperation.setAttribute("disabled", "disabled");
    NotesSem.addEventListener("change", (e) => {
      e.preventDefault();
      NotesSem.style.display = "block";

      NotesBranch.setAttribute("disabled", "disabled");
      NotesSem.setAttribute("disabled", "disabled");

      subjectCode.style.display = "block";

      var selectedSem = NotesSem.options[NotesSem.selectedIndex].value;
      var selectedBranch = NotesBranch.options[NotesBranch.selectedIndex].value;
      console.log(selectedSem, selectedBranch);
      db.collection(
        "branch/" +
        selectedBranch.toLowerCase() +
        "/" +
        selectedSem.toLowerCase()
      )
        .get()
        .then((snapshot) => {
          var val = snapshot.docs;
          for (i = 0; i < val.length; i++) {
            let option = document.createElement("option");
            option.value = val[i].id;
            option.setAttribute("id", "subject-code");
            option.text = val[i].data().id;
            subjectCode.appendChild(option);
          }
          subjectCode.addEventListener("change", (e) => {
            e.preventDefault();
            var subCode = subjectCode.options[subjectCode.selectedIndex].value;
            console.log(subCode);
            if (selectedOperation == "true") {
              moduleInput.style.display = "block";

              NotesForm.addEventListener("submit", (e) => {
                e.preventDefault();
                db.collection(
                  "branch/" +
                  selectedBranch.toLowerCase() +
                  "/" +
                  selectedSem.toLowerCase()
                )
                  .doc(subCode)
                  .set(
                    {
                      modules: firebase.firestore.FieldValue.arrayUnion(
                        NotesForm["module"].value
                      ),
                    },
                    { merge: true },
                    (err) => console.log(err)
                  )
                  .then(() => {
                    //close the create modal & reset form
                    const modal = document.querySelector("#modal-notes");
                    M.Modal.getInstance(modal).close();
                    NotesForm.reset();
                    location.reload();
                  });
              });
            } else {
              notesInput.style.display = "block";
                fileButton.addEventListener('change', (e) => {
                    e.preventDefault();
                    var file = e.target.files[0];
                    NotesForm.addEventListener("submit", (e) => {
                        e.preventDefault();

                        console.log(file);
                        var storageRef = storage.ref('notes/' + file.name);
                        var task = storageRef.put(file);
                        task.on('state_changes', (snapshot) => {
                            var percentage = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
                            uploader.value = percentage;
                            console.log(snapshot);
                        }, err => console.log(err));
                    
                        task.then(() => {
                              storageRef.getDownloadURL().then(url => {
                                db.collection(
                                    "branch/" +
                                    selectedBranch.toLowerCase() +
                                    "/" +
                                    selectedSem.toLowerCase()
                                  )
                                    .doc(subCode)
                                    .set(
                                      {
                                        notes: firebase.firestore.FieldValue.arrayUnion(
                                          url
                                        ),
                                      },
                                      { merge: true },
                                      (err) => console.log(err)
                                    )
                                    .then(() => {
                                      //close the create modal & reset form
                                      const modal = document.querySelector("#modal-notes");
                                      M.Modal.getInstance(modal).close();
                                      NotesForm.reset();
                                      location.reload();
                                    });
                                
                            })
                    } )
                        

      
                      
                      
                    });
                })
            }
          });
        });
    });
  });
});



