const viewBranch = document.querySelector('#select-view-branch');
const viewsem = document.querySelector('#select-view-sem');
const subjectList = document.querySelector('#subject-list');
viewBranch.addEventListener('change', (e) => {
    viewsem.addEventListener('change', (e) => {


        var selectedbranch =
            viewBranch.options[viewBranch.selectedIndex].value;
        var selectedsem =
            viewsem.options[viewsem.selectedIndex].value;
        console.log(selectedsem, selectedbranch.toLowerCase());

        db.collection('branch/' + selectedbranch.toLowerCase() + '/' + selectedsem.toLowerCase()).orderBy('id').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            subjectList.innerHTML = '';
            console.log(changes.length);
            if (changes.length) {
                changes.forEach(change => {
                    if (change.type == 'added') {
                        renderSubjects(change.doc);

                    } else if (change.type == 'removed') {
                        let li = subjectList.querySelector('[data-id=' + change.doc.id + ']');
                        li.className = 'center';
                        subjectList.removeChild(li);
                    }
                });
            } else {
                let h3 = document.createElement('h4');
                h3.innerHTML = 'Not found';
                subjectList.appendChild(h3);
            }



            function renderSubjects(doc) {



                const subject = doc.data();

                let li = document.createElement('li');
                let div = document.createElement('div');
                let name = document.createElement('strong');
                let divColabsiblebody = document.createElement('div');
                let title = document.createElement('strong');
                let module = document.createElement('strong');
                let ul = document.createElement('ul');
                let notesUl = document.createElement('ul');
                let note = document.createElement('strong');

                let br = document.createElement('br');
                let desc = document.createElement('p');
                let delBtn = document.createElement('button');


                li.setAttribute('data-id', doc.id);
                div.className = 'collapsible-header';
                designation.style.marginLeft = '5px';
                // date.className = 'badge';
                delBtn.className = 'btn red darken-2';
                delBtn.id = 'delBtn';
                divColabsiblebody.className = 'collapsible-body';
                name.textContent = subject.id.toUpperCase();
                title.textContent = subject.name.toUpperCase();
                module.innerHTML = 'Modules';
                note.innerHTML = 'Notes';
                ul.appendChild(module);
                notesUl.appendChild(note);


                // date.textContent = formatDate(subject.createdAt);
                subject.modules.forEach((module) => {
                    let li = document.createElement('li');

                    li.textContent = module;
                    ul.appendChild(li);

                });
                subject.notes.forEach((url) => {
                    let li = document.createElement('li');

                    let a = document.createElement('a');
                    a.setAttribute('href', url);

                    var myRegexp = /.+(\/|%2F)(.+)\?.+/g;
                    var match = myRegexp.exec(url);
                    a.textContent = match[2];
                    li.appendChild(a)
                    notesUl.appendChild(li);

                });

                desc.textContent = subject.description;
                delBtn.innerHTML = 'DELETE';





                li.appendChild(div);
                div.appendChild(name);
                li.appendChild(divColabsiblebody);
                divColabsiblebody.appendChild(title);
                divColabsiblebody.appendChild(br);

                divColabsiblebody.appendChild(ul);
                divColabsiblebody.appendChild(br);
                divColabsiblebody.appendChild(notesUl);
                divColabsiblebody.appendChild(br);
                divColabsiblebody.appendChild(desc);
                divColabsiblebody.appendChild(delBtn);
                subjectList.appendChild(li);







                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let id = e.target.parentElement.parentElement.getAttribute('data-id');
                    db.collection('branch/' + selectedbranch.toLowerCase() + '/' + selectedsem.toLowerCase()).doc(id).delete().then(() => {
                        M.toast({ html: 'Subject Was Deleted' });
                    });
                });
            }
        });

    });

});
