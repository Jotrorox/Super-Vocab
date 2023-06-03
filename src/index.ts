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

var key = new Key();

var card = new SimpleCard(
    'Test Card',
    'This is a test card'
);

card.addTag('api-test');

card.send(key);