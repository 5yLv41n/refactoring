function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;

        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;

            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 1000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`Unknown type: ${play.type}`);
        }

        // ajoute des crédits de volume
        volumeCredits += Math.max(perf.audience - 30, 0);
        // ajoute un crédit par groupe de cinq spectateurs assistant à une comédie
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

        // imprime la ligne de cette commande
        result += ` ${play.name} : ${format(thisAmount/100)} (${perf.audience} seats) \n`;
        totalAmount += thisAmount;
    }

    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits`;

    return result;
}

let invoice = '[{"customer": "BigCo","performances": [{  "playID": "hamlet",  "audience": "55"},{"playID": "as-like","audience": "35"},{"playID": "othello","audience": "40"}]}]';
let plays = '{"hamlet": {"name": "Hamlet","type": "tragedy"},"as-like": {"name": "As You Like It","type": "comedy"},"othello": {"name": "Othello","type": "tragedy"}}';

let playsJson = JSON.parse(plays);
let invoiceJson = JSON.parse(invoice);

console.log(statement(invoiceJson[0], playsJson));