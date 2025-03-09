const modal = document.getElementById("modal")
const modalText = modal.querySelector("p")

const showModal = text => {
    modal.style.display = "flex"
    modalText.innerText = text
}

const removeModal = () => modal.style.display = "none"

export {showModal, removeModal}