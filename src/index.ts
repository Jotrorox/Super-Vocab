import { readFileSync } from "fs";

const baseUrl = 'https://api.supernotes.app/v1';

class Key {
    key: string;

    constructor() {;
        this.key = JSON.parse(
                readFileSync('./config.json', 'utf8')
            ).key;
    }
}

class SimpleCard {
    name: string;
    markup: string;
    tags?: string[] | undefined;
    id?: string | undefined;

    constructor(name: string, markup: string, tags?: string[]) {
        this.name = name;
        this.markup = markup;
        if (tags) {
            this.tags = tags;
        }
    }

    addTag(tag: string) {
        if (this.tags) {
            this.tags.push(tag);
        } else {
            this.tags = [tag];
        }
    }

    setId(id: string) {
        this.id = id;
    }

    async send(key: Key) { 
        await fetch(`${baseUrl}/cards/simple`, {
            headers: {
                'Api-Key': key.key,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                name: this.name,
                markup: this.markup,
                tags: this.tags,

            }),
        });
    }

    // TODO: Add fix that: returns "undefined"
    //async sendSetId(key: Key) {
    //    const response = await fetch(`${baseUrl}/cards/simple`, {
    //        headers: {
    //            'Api-Key': key.key,
    //            'Content-Type': 'application/json',
    //        },
    //        method: 'POST',
    //        body: JSON.stringify({
    //            name: this.name,
    //            markup: this.markup,
    //            tags: this.tags,
    //        }),
    //    });
    //    const jsonResponse = await response.json().then((data) => {
    //        return data.card_id;
    //    });
    //}
}

async function getVocabCardIDs() : Promise<string[]> {
    var filter = {
        filter_group: {
            operator: 'and',
            filters: [
                {
                    type: 'tag',
                    operator: 'contains',
                    arg: "super-vocaber-card",
                },
            ],
        },
    }

    var response = await fetch(`${baseUrl}/cards/get/select`, {
        headers: {
            'Api-Key': key.key,
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(filter),
    });
    return Object.keys(await response.json());
}

async function setCardDue(cardID: string) {
    console.log(`Set Due: ${cardID}`);
}

async function checkCardDue(cardID: string) : Promise<boolean> {
    var filter = {
        filter_group: { 
            operator: 'and',
        },
        modified_when: {
            from_when: new Date('2021-01-01T00:00:00.000Z'),
            to_when: new Date('2023-06-09T00:00:00.000Z'),
        },
    }

    var response = await fetch(`${baseUrl}/cards/get/select`, {
        headers: {
            'Api-Key': key.key,
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(filter),
    });
    if (response.ok) {
        var cardIDs = Object.keys(await response.json());
        console.log(cardIDs);
        if (cardIDs.includes(cardID) ) {
            return true;
        } else {
            return false;
        }
    } else {
        console.log(`Error at request: ${response.status}`);
        console.log("Body: " + await response.json());
        return false;
    }
}

async function checkForReviews() {
    var vocabCardIDs = await getVocabCardIDs().then((data) => {
        data.forEach(async element => {
            if (await checkCardDue(element)) {
                await setCardDue(element);
            }
        });
    });
}

var key = new Key();

var card = new SimpleCard(
    'Test Card',
    'This is a test card'
);

card.addTag('api-test');

// card.send(key);

await checkForReviews();