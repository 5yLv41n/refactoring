function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;
    for (let perf of invoice.performances) {
        let thisAmount = amountFor(perf, playFor(perf));

        // ajoute des crédits de volume
        volumeCredits += Math.max(perf.audience - 30, 0);
        // ajoute un crédit par groupe de cinq spectateurs assistant à une comédie
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);

        // imprime la ligne de cette commande
        result += ` ${playFor(perf).name} : ${format(thisAmount/100)} (${perf.audience} seats) \n`;
        totalAmount += thisAmount;
    }

    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits`;

    return result;
}

function amountFor(aPerformance, play) {
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

let invoice = '[{"customer": "BigCo","performances": [{  "playID": "hamlet",  "audience": "55"},{"playID": "as-like","audience": "35"},{"playID": "othello","audience": "40"}]}]';
let plays = '{"hamlet": {"name": "Hamlet","type": "tragedy"},"as-like": {"name": "As You Like It","type": "comedy"},"othello": {"name": "Othello","type": "tragedy"}}';

let playsJson = JSON.parse(plays);
let invoiceJson = JSON.parse(invoice);

console.log(statement(invoiceJson[0], playsJson));