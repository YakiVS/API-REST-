const d= document,
                $table=d.querySelector(".crud-table"),
                $form=d.querySelector(".crud-form"),
                $title=d.querySelector(".crud-title"),
                $template=d.getElementById("crud-template").content,
                $fragment=d.createDocumentFragment();

const getAll = async () => {
    try {
        let res= await fetch('http://localhost:3000/users'),
        json = await res.json();
        
        if (!res.ok) throw { status: res.status, statusText:res.statusText };

        console.log(json);

        json.forEach(element => {
            $template.querySelector(".name").textContent=element.name;
            $template.querySelector(".username").textContent=element.username;
            $template.querySelector(".email").textContent=element.email;
            $template.querySelector(".edit").dataset.id=element.id;
            $template.querySelector(".edit").dataset.name=element.name;
            $template.querySelector(".edit").dataset.username=element.username;
            $template.querySelector(".edit").dataset.email=element.email;
            $template.querySelector(".delete").dataset.id=element.id;

            let $clone = d.importNode($template,true);
            $fragment.appendChild($clone);
            
        });

        $table.querySelector("tbody").appendChild($fragment);

    } catch (error) {
        let message = error.statusText || "Ocurrio un error";
        $table.insertAdjacentHTML("afterend",`<p><b> Error: ${error.status} : ${message}</b></p>`)
    }
}

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async e => {
    if (e.target === $form) {
        e.preventDefault();

        if (!e.target.id.value) {
            // POST 
            try {
                let options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        name: e.target.nombre.value,
                        username: e.target.username.value,
                        email: e.target.email.value
                    })
                }; 

                let res = await fetch("http://localhost:3000/users", options);
                let json = await res.json();

                console.log(json); 
            } catch (error) {
                let message = error.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error : ${error.status}:${message}</b></p>`);
            }
        } else {
            // PUT
            try {
                let options = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        name: e.target.nombre.value,
                        username: e.target.username.value,
                        email: e.target.email.value
                    })
                }; 

                let res = await fetch(`http://localhost:3000/users/${e.target.id.value}`, options);
                let json = await res.json();

                console.log(json); 
            } catch (error) {
                let message = error.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error : ${error.status}:${message}</b></p>`);
            }
        }
    }
});

d.addEventListener("click", async e => {
    if (e.target.matches(".edit")) {
        $title.textContent = "Editar Usuario";
        $form.nombre.value = e.target.dataset.name; 
        $form.username.value = e.target.dataset.username; 
        $form.email.value = e.target.dataset.email; 
        $form.id.value = e.target.dataset.id;
    }

    if(e.target.matches(".delete")){
        let isDelete = confirm(`¿Estas seguro de eliminar el id ${e.target.dataset.id} ?`);

        if(isDelete){
            //DELETE
            try {
                let options = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    }
                };

                    res = await fetch(`http://localhost:3000/users/${e.target.dataset.id}`, options), // Mover esta línea dentro del try
                    json = await res.json();

                if (!res.ok) throw { status: res.status, statusText: res.statusText };
                location.reload();

            } catch (error) {
                let message = error.statusText || "Ocurrio un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error: ${error.status} : ${message}</b></p>`);
            }
        }
    }
});
