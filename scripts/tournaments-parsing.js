let tournaments_form;
let dataContainer;

(function() {
    document.addEventListener("DOMContentLoaded", () => {
        tournaments_form = document.querySelector('#tournaments-form');
        dataContainer = document.querySelector('#tournaments-output');
    })
})();

const deleteItem = (item) => {
    const values = JSON.parse(localStorage.getItem('tournaments_key'));
    const filteredValues = values.filter((value) => value.id !== item.id);
    localStorage.setItem('tournaments_key', JSON.stringify(filteredValues));
    item.remove();
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tournaments_key')) {
        const schedule = JSON.parse(localStorage.getItem('tournaments_key'));
        schedule.forEach((Tournament) => {
            addTournamentToMarkup(Tournament);
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.delete_output_item_button')) {
            const item = e.target.closest('.tournament_item');
            deleteItem(item);
        }
    });

    tournaments_form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tournaments_formData = new FormData(e.target);
        const values = Object.fromEntries(tournaments_formData);
        if (!values.name) {
            alert('Не введено название');
            return;
        }
        values.owner = (await getUser())[0].name;
        addTournamentToMarkup(values);
    });

    dataContainer.addEventListener('DOMSubtreeModified', () => {
        const items = document.querySelectorAll('.tournament_item');

        let values = [];
        items.forEach((item) => {
            const name = item.getElementsByClassName('tournament_item_name')[0].innerText;
            const type = item.getElementsByClassName('tournament_item_type')[0].innerText;
            const owner = item.getElementsByClassName('tournament_item_owner')[0].innerText;
            const id = item.id;

            values.push({name, type, owner, id});
        });

        localStorage.setItem('tournaments_key', JSON.stringify(values));
    })
})

const addTournamentToMarkup = (Tournament) => {
    const markup = `
        <div class="tournament_item" id="${new Date().getTime()}">
          <div class="tournament_item_body">
            <h3>
              <span class="tournament_item_name">${Tournament.name}</span>
            </h3>
            <p>
              Тип: <span class="tournament_item_type">${Tournament.type}</span>
            </p>
            <p>
              Организатор: <span class="tournament_item_owner">${Tournament.owner}</span>
            </p>
          </div>
          <p class="delete_output_item_button">
            Удалить
          </p>
        </div>
      `;
    dataContainer.insertAdjacentHTML('beforeend', markup);
}


function getUser() {
    const url = "https://jsonplaceholder.typicode.com/users?id=" + (1 + Math.floor(Math.random() * 10));
    return fetch(url, {
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then((res) => {
            if (res.status == 200) {
                return res;
            }
            throw new Error(res.statusText);
        }).then((res) => res.json());
}