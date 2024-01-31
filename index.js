const COHORT = "2311-FSA-ET-WEB-PT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    events: [],
};

const eventList = document.querySelector("#events");
const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);



async function render() {
    await getEvents();
    renderEvents();
};

render();

async function getEvents() {
    try {
        const response = await
        fetch(API_URL);
        const data = await response.json();
        console.log(data);
        state.events = data.data;
        return data;
    } catch (error) {
        console.error(error.message);
    }
}

function renderEvents() {
    if (!state.events.length) {
        eventList.innerHTML = "<li>No events scheduled.</li>"
        return;
    }

    const eventCards = state.events.map((event) => {
        const li = document.createElement("li");
        li.innerHTML = `
        <h2>${event.name}</h2>
        <p>${event.description}</p>
        <p>${event.date}</p>
        <p>${event.location}</P>
        <button onclick="deleteEvent(${event.id})" class="deleteButton">Delete Event</button>
        `;

        
        return li;    

    });



    eventList.replaceChildren(...eventCards);

    
}


async function addEvent(event) {
    event.preventDefault();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: addEventForm.name.value,
                description: addEventForm.description.value,
                date: new Date (addEventForm.date.value),
                location: addEventForm.location.value,
            }),

        });

        console.log(response.body);
        if (!response.ok) {
            throw new Error("Failed to create event")
        }
        render();

    } catch (error) {
        console.error(error);
    }
}


async function deleteEvent(id) {

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        console.log(response.body);
        if (!response.ok) {
            throw new Error("Failed to create event")
        }

        
        render();

    } catch (error) {
        console.error(error);
    }
}
