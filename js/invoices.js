import { getCurrentUser, formatDate } from "./currentUser.js";

const INVOICES_URL = 'https://bever-aca-assignment.azurewebsites.net/invoices'
const INVOICES_LINES_URL = 'https://bever-aca-assignment.azurewebsites.net/invoicelines'
const PRODUCTS_URL = 'https://bever-aca-assignment.azurewebsites.net/products'

const avatar = document.getElementById('avatar');
const logoutMenu = document.getElementById('logoutMenu');
const logoutLink = document.getElementById('logout');
const currentUser = getCurrentUser();

const invoices = await getData(INVOICES_URL);
const userInvoices = invoices.filter(invoice => invoice.UserId === currentUser.UserId);

const invoicesLines = await getData(INVOICES_LINES_URL);
const products = await getData(PRODUCTS_URL);

logoutRender();
renderInvoicesTable();
onInvoiceBtnClick();

function logoutRender() {
  avatar.addEventListener('click', () => {
    logoutMenu.style.display = logoutMenu.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!avatar.contains(e.target) && !logoutMenu.contains(e.target)) {
      logoutMenu.style.display = 'none';
    }
  });

  logoutLink.addEventListener('click', () => {
    sessionStorage.removeItem('loggedIn')
    location.href = 'index.html'
    alert('You have logged out')
  });

  document.querySelector('.user-menu span').textContent = currentUser.Name
}

async function getData(url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data.value
  } catch (error) {
    alert(error)
  }
}

function renderInvoicesTable() {
  userInvoices.forEach(invoice => {
    let row = document.createElement('tr')
    document.querySelector('table tbody').append(row)

    let tdRadio = document.createElement('td')
    row.append(tdRadio)

    let radio = document.createElement('input')
    radio.type = 'radio'
    radio.name = 'invoice'
    radio.id = invoice.InvoiceId
    tdRadio.append(radio)

    let tdName = document.createElement('td')
    tdName.textContent = invoice.Name
    row.append(tdName)

    let tdDate = document.createElement('td')
    tdDate.textContent = formatDate(invoice.PaidDate)
    row.append(tdDate)

    let tdTotalAmount = document.createElement('td')
    tdTotalAmount.textContent = getInvoiceTotalAmout(invoice.InvoiceId);
    row.append(tdTotalAmount)
  })
}

function getCurrentInvoiceLines(id) {
  const currentLines = invoicesLines.filter(line => line.InvoiceId === id)

  currentLines.map(line => {
    const product = products.find(item => line.ProductId === item.ProductId)
    line.productName = product.Name
    line.productPrice = product.Price
  })
  return currentLines
}

function renderInvoicesLines(lines) {
  const tableBody = document.querySelector('.invoices-lines tbody');
  tableBody.innerHTML = '';

  lines.forEach(line => {
    let row = document.createElement('tr')
    tableBody.append(row)

    let tdName = document.createElement('td')
    tdName.textContent = line.productName
    row.append(tdName)

    let tdPrice = document.createElement('td')
    tdPrice.textContent = line.productPrice
    row.append(tdPrice)

    let tdQuantity = document.createElement('td')
    tdQuantity.textContent = line.Quantity
    row.append(tdQuantity)

    let tdTotalAmount = document.createElement('td')
    tdTotalAmount.textContent = line.productPrice * line.Quantity
    row.append(tdTotalAmount)
  })
}

function getInvoiceTotalAmout(id) {
  const currentLines = invoicesLines.filter(line => line.InvoiceId === id)

  return currentLines.reduce((acc, line) => {
    const product = products.find(item => line.ProductId === item.ProductId)
    return acc += product.Price * line.Quantity
  }, 0);
}

function onInvoiceBtnClick() {
  const invoicesRadioBtn = document.querySelectorAll('.invoices input');

  invoicesRadioBtn.forEach(radioBtn => {
    radioBtn.addEventListener('click', (e) => {
      const lines = getCurrentInvoiceLines(radioBtn.id)
      renderInvoicesLines(lines)
    })
  })
}