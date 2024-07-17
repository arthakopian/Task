import { setCurrentUser } from "./currentUser.js"

const form = document.querySelector('form')
const USERS_URL = 'https://bever-aca-assignment.azurewebsites.net/users'

async function userExists(name, password) {
  try {
    const response = await fetch(USERS_URL)
    const data = await response.json()
    const users = data.value
    return users.find(user => user.Name === name && user.Password === password)
  } catch (error) {
    alert(error)
  }
}
document.addEventListener('DOMContentLoaded', () => {
  form.addEventListener('submit', async e => {
    e.preventDefault()

    const name = form.username.value
    const password = form.userpass.value
    const user = await userExists(name, password)
    if (user) {
      setCurrentUser(user)
      console.log(user);
      sessionStorage.setItem('loggedIn', 'true')
      location.href = 'invoices.html'

    } else {
      alert('es xe sti terav')
    }
  })

})


