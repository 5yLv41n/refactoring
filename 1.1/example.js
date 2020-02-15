function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);
        // imprime la ligne de cette commande
        result += ` ${playFor(perf).name} : ${format(amountFor(perf)/100)} (${perf.audience} seats) \n`;
        totalAmount += amountFor(perf);
    }

    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits`;

    return result;
}

function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;

        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 1000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`Unknown type: ${playFor(aPerformance).type}`);
    }

    return result;
}

function playFor(aPerformance) {
    return playsJson[aPerformance.playID];
}

function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);

    return result;
}

function format(number) {
    return new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(number);
}

let invoice = '[{"customer": "BigCo","performances": [{  "playID": "hamlet",  "audience": "55"},{"playID": "as-like","audience": "35"},{"playID": "othello","audience": "40"}]}]';
let plays = '{"hamlet": {"name": "Hamlet","type": "tragedy"},"as-like": {"name": "As You Like It","type": "comedy"},"othello": {"name": "Othello","type": "tragedy"}}';

let playsJson = JSON.parse(plays);
let invoiceJson = JSON.parse(invoice);

console.log(statement(invoiceJson[0], playsJson));