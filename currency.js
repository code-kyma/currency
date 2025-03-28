import { apiKey } from './config.js';
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`;

const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amount = document.getElementById('amount');
const result = document.getElementById('result');
const converterForm = document.getElementById('converter-form')

fetch(apiUrl + 'USD')
    .then(response => response.json())
    .then(data => {
        const currencies = Object.keys(data.conversion_rates);
        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.value = option2.value = currency;
            option1.text = option2.text = currency;
            fromCurrency.appendChild(option1);
            toCurrency.appendChild(option2);

            function restoreCurrencies() {
                fromCurrency.value = localStorage.getItem('from')
                toCurrency.value = localStorage.getItem('to')
                amount.value = localStorage.getItem('amount')
                result.innerText = localStorage.getItem('result')
            }

            restoreCurrencies()
        });
    })
    .catch(error => {
        console.error('Error loading currency list:', error);
    });

converterForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const from1 = fromCurrency.value;
    const to = toCurrency.value;
    const amountValue = amount.value;

    if (!amountValue || amountValue <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    fetch(`${apiUrl}${from1}`)
        .then(response => response.json())
        .then(data => {
            const rate = data.conversion_rates[to];
            const convertedAmount = (amountValue * rate).toFixed(2);
            result.innerText = `${amountValue} ${from1} = ${convertedAmount} ${to}`;

            saveCurrencies()
        })
        .catch(error => {
            alert('Error fetching conversion rates. Please try again.');
            console.error('Error during conversion:', error);
        });
});


function saveCurrencies(){
    localStorage.setItem('from', fromCurrency.value)
    localStorage.setItem('to', toCurrency.value)
    localStorage.setItem('amount', amount.value)
    localStorage.setItem('result', result.innerText)

}


