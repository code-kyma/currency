const apiUrl = 'https://api.frankfurter.app/latest';

const fromCurrencyEl = document.getElementById('from-currency');
const toCurrencyEl = document.getElementById('to-currency');
const amountEl = document.getElementById('amount');
const result = document.getElementById('result');
const converterForm = document.getElementById('converter-form');

fetch('https://api.frankfurter.app/currencies')
    .then(response => response.json())
    .then(data => {
        const currencies = Object.keys(data);
        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.value = option2.value = currency;
            option1.text = option2.text = currency;
            fromCurrencyEl.appendChild(option1);
            toCurrencyEl.appendChild(option2);
        });

        restoreCurrencies();
    })
    .catch(error => {
        console.error('Error loading currency list:', error);
    });

converterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fromCurrency = fromCurrencyEl.value;
    const to = toCurrencyEl.value;
    const amountValue = amountEl.value;

    if (!fromCurrency || !to) {
        alert('Please select both currencies.');
        return;
    }

    if (!amountValue || amountValue <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    if (fromCurrency === to) {
        result.innerText = 'Please select two different currencies.';
        return;
    }

    fetch(`${apiUrl}?amount=${amountValue}&from=${fromCurrency}&to=${to}`)
        .then(response => response.json())
        .then(data => {
            const convertedAmount = data.rates[to].toFixed(2);
            result.innerText = `${amountValue} ${fromCurrency} = ${convertedAmount} ${to}`;
            saveCurrencies();
        })
        .catch(error => {
            alert('Error fetching conversion rates. Please try again.');
            console.error('Error during conversion:', error);
        });
});

function saveCurrencies() {
    localStorage.setItem('from', fromCurrencyEl.value);
    localStorage.setItem('to', toCurrencyEl.value);
    localStorage.setItem('amount', amountEl.value);
    localStorage.setItem('result', result.innerText);
}

function restoreCurrencies() {
    fromCurrencyEl.value = localStorage.getItem('from') || '';
    toCurrencyEl.value = localStorage.getItem('to') || '';
    amountEl.value = localStorage.getItem('amount') || 1000;
    result.innerText = localStorage.getItem('result') || '';
}
