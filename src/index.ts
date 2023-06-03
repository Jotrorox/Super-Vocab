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
    // TODO: Set card due
}

function checkCardDue(cardID: string) : boolean {
    return false;
}

async function checkForReviews() {
    var vocabCardIDs = await getVocabCardIDs().then((data) => {
        data.forEach(async element => {
            if (checkCardDue(element)) {
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